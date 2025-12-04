import { MIDIManager } from "./midiManager";
import { UniformRandom } from "../utils/uniformRandom";
import { MIDI_BUTTON_CONFIGS, FADER_BUTTON_MODE } from "./config";
import { LED_PALETTE, PAGE_LED_PALETTE } from "./ledPalette";

// ========================================
// 型定義
// ========================================

type FaderButtonMode = "mute" | "random";

/** ボタンの入力タイプ */
export type InputType = "radio" | "toggle" | "oneshot" | "momentary" | "random";

/** セルの位置指定 */
export interface CellPosition {
    page?: number;  // デフォルト: 0
    row: number;    // 0=上, 7=下
    col: number;    // 0=左, 7=右
}

/** ボタン設定 */
export interface ButtonConfig {
    key: string;              // アクセスキー: midiInput["key"]
    type: InputType;          // 入力タイプ
    cells: CellPosition[];    // 対象セル
    activeColor?: number;     // アクティブ時のLED色
    inactiveColor?: number;   // 非アクティブ時のLED色
    defaultValue?: number | boolean;

    // randomタイプ専用オプション
    randomTarget?: string;    // ランダム対象のradioボタンのkey
    excludeCurrent?: boolean; // 現在値を除外するか（デフォルト: true）
}

/** 内部管理用: 登録されたセル情報 */
interface RegisteredCell {
    key: string;
    type: InputType;
    cellIndex: number;  // cells配列内のインデックス
    activeColor: number;
    inactiveColor: number;
}

/** MIDI入力値の型 */
export type MidiInputValue = number | boolean;

// ========================================
// 定数
// ========================================

const MIDI_STATUS = {
    NOTE_ON: 0x90,
    NOTE_OFF: 0x80,
    CONTROL_CHANGE: 0xB0,
};

const MIDI_OUTPUT_STATUS = {
    NOTE_ON: 0x96,
};

const NOTE_RANGES = {
    GRID: { START: 0, END: 63 },
    FADER_BUTTONS: { START: 100, END: 107 },
    SIDE_BUTTONS: { START: 112, END: 119 }, // ページ切り替えボタン
    FADERS: { START: 48, END: 56 },
    FADER_BUTTON_8: 122, // 9番目のフェーダーボタン
};

const GRID_ROWS = 8;
const GRID_COLS = 8;

// LED_PALETTE, PAGE_LED_PALETTE は ./ledPalette.ts からインポート
export { LED_PALETTE } from "./ledPalette";


export class APCMiniMK2Manager extends MIDIManager {

    // フェーダー関連
    public faderValues: number[];
    public faderButtonToggleState: boolean[];

    // ページ管理
    public currentPageIndex: number;
    private faderButtonMode: FaderButtonMode;

    // 新しいセル登録システム
    /** セル登録マップ: "page-row-col" → RegisteredCell */
    private cellRegistry: Map<string, RegisteredCell> = new Map();
    /** 入力値ストア: key → value */
    private inputValues: Map<string, MidiInputValue> = new Map();
    /** ボタン設定の保持: key → ButtonConfig */
    private buttonConfigs: Map<string, ButtonConfig> = new Map();
    /** momentary状態管理用 */
    private momentaryState: Map<string, boolean> = new Map();

    constructor() {
        super();
        this.faderValues = new Array(9).fill(0);
        this.faderButtonToggleState = new Array(9).fill(false);
        this.currentPageIndex = 0;
        this.faderButtonMode = FADER_BUTTON_MODE;

        this.onMidiMessageCallback = this.handleMIDIMessage.bind(this);
    }

    // ========================================
    // 公開API: ボタン登録
    // ========================================

    /**
     * ボタンを登録する
     * @param config - ボタン設定
     * @throws 同じセルに複数のキーを登録しようとした場合
     */
    public registerButton(config: ButtonConfig): void {
        const { key, type, cells, activeColor, inactiveColor, defaultValue } = config;

        // 重複チェック
        for (let cellIndex = 0; cellIndex < cells.length; cellIndex++) {
            const cell = cells[cellIndex];
            const page = cell.page ?? 0;
            const cellKey = this.getCellKey(page, cell.row, cell.col);

            if (this.cellRegistry.has(cellKey)) {
                const existing = this.cellRegistry.get(cellKey)!;
                throw new Error(
                    `セル (page=${page}, row=${cell.row}, col=${cell.col}) は既に "${existing.key}" に登録されています。` +
                    `"${key}" を登録できません。`
                );
            }
        }

        // セルを登録
        for (let cellIndex = 0; cellIndex < cells.length; cellIndex++) {
            const cell = cells[cellIndex];
            const page = cell.page ?? 0;
            const cellKey = this.getCellKey(page, cell.row, cell.col);

            const registeredCell: RegisteredCell = {
                key,
                type,
                cellIndex,
                activeColor: activeColor ?? LED_PALETTE.ON,
                inactiveColor: inactiveColor ?? LED_PALETTE.DIM,
            };

            this.cellRegistry.set(cellKey, registeredCell);
        }

        // ボタン設定を保持
        this.buttonConfigs.set(key, config);

        // デフォルト値を設定
        if (defaultValue !== undefined) {
            this.inputValues.set(key, defaultValue);
        } else {
            // 型に応じたデフォルト値
            switch (type) {
                case "radio":
                    this.inputValues.set(key, 0);
                    break;
                case "toggle":
                    this.inputValues.set(key, false);
                    break;
                case "oneshot":
                    this.inputValues.set(key, false);
                    break;
                case "momentary":
                    this.inputValues.set(key, false);
                    this.momentaryState.set(key, false);
                    break;
                case "random":
                    // randomタイプ自体は値を持たない（トリガーとして機能）
                    this.inputValues.set(key, false);
                    break;
            }
        }
    }

    /**
     * 複数のボタンを一括登録する
     * @param configs - ボタン設定の配列
     */
    public registerButtons(configs: ButtonConfig[]): void {
        for (const config of configs) {
            this.registerButton(config);
        }
    }

    // ========================================
    // 公開API: 入力値取得
    // ========================================

    /**
     * MIDI入力値を取得する
     */
    get midiInput(): Record<string, MidiInputValue> {
        return Object.fromEntries(this.inputValues);
    }

    // ========================================
    // 更新処理
    // ========================================

    /**
     * フレーム更新処理
     * @param beat - 現在のビート数（BPM同期用、将来のランダムモード用に予約）
     */
    public update(_beat: number): void {
        // oneshotをリセット
        this.resetOneshotValues();

        // フェーダーボタンのミュート/ランダム処理
        this.updateFaderButtonEffects(_beat);

        // LED出力
        this.midiOutputSendControls();
    }

    /**
     * oneshotタイプの値をリセット
     */
    private resetOneshotValues(): void {
        for (const [key, config] of this.buttonConfigs) {
            if (config.type === "oneshot") {
                this.inputValues.set(key, false);
            }
        }
    }

    /**
     * フェーダーボタンの効果を適用（ミュートまたはランダム）
     */
    private updateFaderButtonEffects(beat: number): void {
        for (let col = 0; col < 8; col++) {
            if (!this.faderButtonToggleState[col]) {
                continue;
            }

            if (this.faderButtonMode === "random") {
                this.faderValues[col] = UniformRandom.rand(Math.floor(beat), col) < 0.5 ? 0 : 1;
            } else if (this.faderButtonMode === "mute") {
                this.faderValues[col] = 0;
            }
        }
    }

    // ========================================
    // MIDI入力処理
    // ========================================

    /**
     * @param message - 受信したMIDIメッセージイベント
     */
    protected handleMIDIMessage(message: WebMidi.MIDIMessageEvent): void {
        const [statusByte, dataByte1, dataByte2] = message.data;
        const noteNumber = dataByte1;
        const velocity = dataByte2;

        this.handleFaderButton(statusByte, noteNumber, velocity);
        this.handleSideButton(statusByte, noteNumber, velocity);
        this.handleGridPad(statusByte, noteNumber, velocity);
        this.handleFaderControlChange(statusByte, noteNumber, velocity);
    }

    /**
     * フェーダーボタンの処理
     */
    private handleFaderButton(statusByte: number, noteNumber: number, velocity: number): void {
        const isFaderButton =
            (statusByte === MIDI_STATUS.NOTE_ON || statusByte === MIDI_STATUS.NOTE_OFF) &&
            ((noteNumber >= NOTE_RANGES.FADER_BUTTONS.START && noteNumber <= NOTE_RANGES.FADER_BUTTONS.END) ||
                noteNumber === NOTE_RANGES.FADER_BUTTON_8);

        if (!isFaderButton) {
            return;
        }

        let index: number;
        if (noteNumber === NOTE_RANGES.FADER_BUTTON_8) {
            index = 8;
        } else {
            index = noteNumber - NOTE_RANGES.FADER_BUTTONS.START;
        }

        this.faderButtonToggleState[index] = (velocity > 0) ? !this.faderButtonToggleState[index] : this.faderButtonToggleState[index];
    }

    /**
     * サイドボタン（ページ切り替え）の処理
     */
    private handleSideButton(statusByte: number, noteNumber: number, velocity: number): void {
        const isSideButton = statusByte === MIDI_STATUS.NOTE_ON &&
            noteNumber >= NOTE_RANGES.SIDE_BUTTONS.START &&
            noteNumber <= NOTE_RANGES.SIDE_BUTTONS.END;

        if (!isSideButton) {
            return;
        }

        if (velocity <= 0) {
            return;
        }

        const pageIndex = noteNumber - NOTE_RANGES.SIDE_BUTTONS.START;
        if (pageIndex < 0 || pageIndex >= GRID_COLS) {
            return;
        }
        this.currentPageIndex = pageIndex;
    }

    /**
     * グリッドパッドの処理（新しいセル登録システム）
     */
    private handleGridPad(statusByte: number, noteNumber: number, velocity: number): void {
        const isNoteOn = statusByte === MIDI_STATUS.NOTE_ON;
        const isNoteOff = statusByte === MIDI_STATUS.NOTE_OFF;

        if (!isNoteOn && !isNoteOff) {
            return;
        }

        if (noteNumber < NOTE_RANGES.GRID.START || noteNumber > NOTE_RANGES.GRID.END) {
            return;
        }

        const gridIndex = noteNumber - NOTE_RANGES.GRID.START;
        const col = gridIndex % GRID_COLS;
        const row = GRID_ROWS - 1 - Math.floor(gridIndex / GRID_COLS); // 反転補正

        const cellKey = this.getCellKey(this.currentPageIndex, row, col);
        const registeredCell = this.cellRegistry.get(cellKey);

        // 未登録セルはスルー
        if (!registeredCell) {
            return;
        }

        const { key, type, cellIndex } = registeredCell;

        if (isNoteOn && velocity > 0) {
            // ボタン押下
            switch (type) {
                case "radio":
                    this.inputValues.set(key, cellIndex);
                    break;
                case "toggle":
                    const currentToggle = this.inputValues.get(key) as boolean;
                    this.inputValues.set(key, !currentToggle);
                    break;
                case "oneshot":
                    this.inputValues.set(key, true);
                    break;
                case "momentary":
                    this.inputValues.set(key, true);
                    this.momentaryState.set(key, true);
                    break;
                case "random":
                    this.triggerRandom(key);
                    break;
            }
        } else if ((isNoteOff || (isNoteOn && velocity === 0)) && type === "momentary") {
            // ボタン離した（momentaryのみ）
            this.inputValues.set(key, false);
            this.momentaryState.set(key, false);
        }
    }

    /**
     * フェーダーのコントロールチェンジ処理
     */
    private handleFaderControlChange(statusByte: number, noteNumber: number, value: number): void {
        const isFaderControlChange = statusByte === MIDI_STATUS.CONTROL_CHANGE &&
            noteNumber >= NOTE_RANGES.FADERS.START &&
            noteNumber <= NOTE_RANGES.FADERS.END;

        if (!isFaderControlChange) {
            return;
        }

        const index = noteNumber - NOTE_RANGES.FADERS.START;
        const normalizedValue = value / 127;
        this.faderValues[index] = normalizedValue;
    }

    // ========================================
    // LED出力処理
    // ========================================

    /**
     * 各種LED出力をまとめて送信
     */
    protected midiOutputSendControls(): void {
        this.sendPageButtonLeds();
        this.sendGridPadLeds();
        this.sendFaderButtonLeds();
    }

    /**
     * ページ切り替えボタンのLED出力
     */
    private sendPageButtonLeds(): void {
        for (let i = 0; i < 8; i++) {
            const note = NOTE_RANGES.SIDE_BUTTONS.START + i;
            const velocity = (i === this.currentPageIndex) ? PAGE_LED_PALETTE[i] : LED_PALETTE.OFF;
            this.send(MIDI_STATUS.NOTE_ON, note, velocity);
        }
    }

    /**
     * グリッドパッドのLED出力（新しいセル登録システム）
     */
    private sendGridPadLeds(): void {
        for (let col = 0; col < GRID_COLS; col++) {
            for (let row = 0; row < GRID_ROWS; row++) {
                const gridIndex = (GRID_ROWS - 1 - row) * GRID_COLS + col;
                const note = NOTE_RANGES.GRID.START + gridIndex;
                const velocity = this.getGridPadVelocity(this.currentPageIndex, row, col);
                this.send(MIDI_OUTPUT_STATUS.NOTE_ON, note, velocity);
            }
        }
    }

    /**
     * フェーダーボタンのLED出力
     */
    private sendFaderButtonLeds(): void {
        for (let i = 0; i < 9; i++) {
            const note = (i < 8)
                ? NOTE_RANGES.FADER_BUTTONS.START + i
                : NOTE_RANGES.FADER_BUTTON_8;
            const velocity = this.faderButtonToggleState[i] ? LED_PALETTE.ON : LED_PALETTE.OFF;
            this.send(MIDI_STATUS.NOTE_ON, note, velocity);
        }
    }

    /**
     * グリッドパッドのLED色を取得
     */
    private getGridPadVelocity(pageIndex: number, row: number, col: number): number {
        const cellKey = this.getCellKey(pageIndex, row, col);
        const registeredCell = this.cellRegistry.get(cellKey);

        // 未登録セルはOFF
        if (!registeredCell) {
            return LED_PALETTE.OFF;
        }

        const { key, type, cellIndex, activeColor, inactiveColor } = registeredCell;
        const currentValue = this.inputValues.get(key);

        switch (type) {
            case "radio":
                return currentValue === cellIndex ? activeColor : inactiveColor;
            case "toggle":
                return currentValue === true ? activeColor : inactiveColor;
            case "oneshot":
                return currentValue === true ? activeColor : inactiveColor;
            case "momentary":
                return this.momentaryState.get(key) === true ? activeColor : inactiveColor;
            case "random":
                // randomボタンは常にactiveColor（押すとトリガー）
                return activeColor;
            default:
                return LED_PALETTE.OFF;
        }
    }

    // ========================================
    // ヘルパー
    // ========================================

    /**
     * randomタイプのボタンが押されたときの処理
     * 対象のradioボタンをランダムに切り替える
     */
    private triggerRandom(randomKey: string): void {
        const config = this.buttonConfigs.get(randomKey);
        if (!config || config.type !== "random") {
            return;
        }

        const targetKey = config.randomTarget;
        if (!targetKey) {
            console.warn(`randomボタン "${randomKey}" にrandomTargetが設定されていません`);
            return;
        }

        const targetConfig = this.buttonConfigs.get(targetKey);
        if (!targetConfig) {
            console.warn(`randomTarget "${targetKey}" が見つかりません`);
            return;
        }

        if (targetConfig.type !== "radio") {
            console.warn(`randomTarget "${targetKey}" はradioタイプではありません（type: ${targetConfig.type}）`);
            return;
        }

        const cellCount = targetConfig.cells.length;
        if (cellCount <= 1) {
            return; // 選択肢が1つ以下なら何もしない
        }

        const currentValue = this.inputValues.get(targetKey) as number;
        const excludeCurrent = config.excludeCurrent !== false; // デフォルトtrue

        let newValue: number;
        if (excludeCurrent) {
            // 現在値を除外してランダム選択
            const candidates = [];
            for (let i = 0; i < cellCount; i++) {
                if (i !== currentValue) {
                    candidates.push(i);
                }
            }
            newValue = candidates[Math.floor(Math.random() * candidates.length)];
        } else {
            // 全ての選択肢からランダム選択
            newValue = Math.floor(Math.random() * cellCount);
        }

        this.inputValues.set(targetKey, newValue);
    }

    /**
     * セルのキーを生成
     */
    private getCellKey(page: number, row: number, col: number): string {
        return `${page}-${row}-${col}`;
    }

    /**
     * MIDIメッセージを送信
     */
    private send(status: number, note: number, velocity: number): void {
        this.sendMessage([status, note, velocity]);
    }

    /**
     * 初期化処理
     * 親クラスのMIDI初期化を行い、設定ファイルからボタンを登録します。
     */
    public async init(): Promise<void> {
        // 親クラスのMIDI初期化を待つ
        await super.init();

        // 設定ファイルからボタンを登録
        if (MIDI_BUTTON_CONFIGS.length > 0) {
            this.registerButtons(MIDI_BUTTON_CONFIGS);
            console.log(`📋 MIDI設定: ${MIDI_BUTTON_CONFIGS.length}件のボタンを登録しました`);
        }
    }

    /**
     * MIDIデバイスの利用可能性が変化した際のハンドラ
     */
    protected override onMidiAvailabilityChanged(available: boolean): void {
        super.onMidiAvailabilityChanged(available);

        if (available) {
            console.log("🎹 APC Mini MK2: 接続されました");
            // 接続時にLEDを初期化
            this.midiOutputSendControls();
        } else {
            console.warn("🎹 APC Mini MK2: 接続されていません");
        }
    }
}