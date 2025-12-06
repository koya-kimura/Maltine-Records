import p5 from "p5";
import { DateText } from "../utils/dateText";
import { map } from "../utils/mathUtils";
import { APCMiniMK2Manager } from "../midi/APCMiniMK2Manager";
import { UniformRandom } from "../utils/uniformRandom";
import { GVM } from "../utils/gvm";
import { Easing } from "../utils/easing";

type UIDrawFunction = (p: p5, tex: p5.Graphics, font: p5.Font, logo: p5.Image | undefined, beat: number) => void;

const UINone: UIDrawFunction = (_p: p5, tex: p5.Graphics, _font: p5.Font, _logo: p5.Image | undefined, _beat: number): void => {
    tex.push();
    tex.pop();
}

const UIDraw01: UIDrawFunction = (p: p5, tex: p5.Graphics, font: p5.Font, _logo: p5.Image | undefined, _beat: number): void => {
    tex.push();
    tex.textFont(font);

    const m = 3;
    const textArray1 = [..."MaltineRecords"];
    const textArray2 = [..."Gigandect"];
    for (let j = 0; j < m; j++) {
        const cx = map(j, 0, m - 1, 0.17, 0.83) * tex.width;
        const cy = tex.height * 0.5;
        const arr = j % 2 === 0 ? textArray1 : textArray2;
        const n = arr.length * 2;

        tex.push();
        tex.translate(cx, cy);
        for (let i = 0; i < n; i++) {
            const str = arr[i % arr.length];
            const angle = Math.PI * 2 * i / n + _beat * 0.5;
            const radius = Math.min(tex.width, tex.height) * (j % 2 == 0 ? 0.2 : 0.25);
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            const s = Math.min(tex.width, tex.height) * 0.5 / arr.length;

            tex.push();
            tex.fill(255);
            tex.noStroke();
            tex.textSize(s);
            tex.textAlign(p.CENTER, p.CENTER);
            tex.translate(x, y);
            tex.rotate(angle + Math.PI / 2);
            tex.text(str, 0, 0);
            tex.pop();

        }
        tex.pop();
    }

    tex.pop();
}

const UIDraw02: UIDrawFunction = (p: p5, tex: p5.Graphics, font: p5.Font, logo: p5.Image | undefined, _beat: number): void => {
    tex.push();
    tex.textFont(font);

    tex.textSize(tex.width * 0.05);
    tex.fill(255);
    tex.noStroke();

    tex.textAlign(p.LEFT, p.CENTER);
    tex.text("Gigandect", tex.width * 0.05, tex.height * 0.5);

    tex.textAlign(p.RIGHT, p.CENTER);
    tex.text("Gigandect", tex.width * 0.95, tex.height * 0.5);

    if (logo) {
        for (let i = 0; i < 5; i++) {
            const x = map(i, 0, 4, tex.width * 0.12, tex.width * 0.88);
            const w = tex.width * 0.1;
            const h = w * (logo.height / logo.width);

            tex.imageMode(p.CENTER);
            tex.image(logo, x, tex.height * 0.95, w, h);
        }
    }

    tex.pop();
}

const UIDraw03: UIDrawFunction = (p: p5, tex: p5.Graphics, font: p5.Font, logo: p5.Image | undefined, _beat: number): void => {
    if (logo) {
        tex.push();
        tex.imageMode(p.CENTER);
        tex.translate(tex.width * 0.95 - tex.width * 0.1, tex.height / 2);
        const w = tex.width * 0.2 / logo.width;
        tex.scale(w);
        tex.image(logo, 0, 0);
        tex.pop();
    }

    tex.push();
    tex.textAlign(p.RIGHT, p.BOTTOM);
    tex.translate(tex.width * 0.95, tex.height * 0.95);
    tex.textSize(tex.width * 0.015);
    tex.fill(255);
    tex.noStroke();
    tex.textFont(font);
    tex.text(DateText.getYYYYMMDD_HHMMSS_format(), 0, 0);
    tex.pop();
}

const UIDraw04: UIDrawFunction = (p: p5, tex: p5.Graphics, font: p5.Font, logo: p5.Image | undefined, _beat: number): void => {
    tex.push();
    tex.textAlign(p.CENTER, p.CENTER);
    tex.textFont(font);
    tex.fill(255);
    tex.noStroke();

    const n = 10;
    const m = 6;
    for (let j = 0; j < m; j++) {
        for (let i = 0; i < n; i++) {
            const index = Math.floor(GVM.leapRamp(_beat + Math.floor(UniformRandom.rand(j, i) * 1000), 16, 2, Easing.linear) * 16);
            const str = [..."MaltineRecords"][index % "MaltineRecords".length];
            const x = map(i, 0, n - 1, tex.width * 0.1, tex.width * 0.9);
            const y = map(j, 0, m - 1, tex.height * 0.1, tex.height * 0.9);
            const s = tex.width * 0.05;

            tex.push();
            tex.textSize(s);
            tex.translate(x, y);
            tex.rotate(0);
            tex.text(str, 0, 0);
            tex.pop();
        }
    }
    tex.pop();
}

// UIDraw05用のキャッシュ
let uiDraw05Cache: { pg: p5.Graphics; size: number } | null = null;

const UIDraw05: UIDrawFunction = (p: p5, tex: p5.Graphics, font: p5.Font, _logo: p5.Image | undefined, _beat: number): void => {
    const s = Math.min(tex.width, tex.height) * 0.3;

    // キャッシュがないか、サイズが変わった場合のみ再作成
    if (!uiDraw05Cache || uiDraw05Cache.size !== s) {
        // 既存のキャッシュがあれば削除
        if (uiDraw05Cache) {
            uiDraw05Cache.pg.remove();
        }

        const pg = p.createGraphics(s, s);
        const str = "G";
        pg.push();
        pg.clear();
        pg.textFont(font);
        pg.textSize(s * 1.38);
        pg.fill(255);
        pg.noStroke();
        pg.textAlign(p.CENTER, p.CENTER);
        pg.text(str, s * 0.5, s * 0.65);
        pg.pop();

        uiDraw05Cache = { pg, size: s };
    }

    const pg = uiDraw05Cache.pg;

    for (let j of [-1, 1]) {
        for (let i of [-1, 1]) {
            const x = tex.width * 0.5 + i * tex.width * 0.5 - i * s * 0.5;
            const y = tex.height * 0.5 + j * tex.height * 0.5 - j * s * 0.5;
            const angle = _beat * 0.5 * (i * j);

            tex.push();
            tex.imageMode(p.CENTER);
            tex.translate(x, y);
            tex.rotate(angle);
            tex.image(pg, 0, 0);
            tex.pop();
        }
    }
}

const UIDraw06: UIDrawFunction = (p: p5, tex: p5.Graphics, font: p5.Font, _logo: p5.Image | undefined, _beat: number): void => {
    tex.push();
    tex.clear();
    tex.translate(tex.width / 2, tex.height / 2);

    for (let j of [0.5, 0.95]) {
        tex.push();
        const n = 100 * j;
        for (let i = 0; i < n; i++) {
            const cw = tex.width * j;
            const ch = tex.height * j;
            const l = cw * 2 + ch * 2;
            const k = (p.map(i, 0, n, 0, l) + p.millis() * 0.1) % l;
            const index = (UniformRandom.rand(i + j * 75920, Math.floor(_beat)) < 0.9 ? i : Math.floor(UniformRandom.rand(i + j * 75920, Math.floor(_beat * 8.0)) * 100)) % 9;

            let x = 0;
            let y = 0;
            let angle = 0;
            if (k < cw) {
                x = -cw / 2 + k;
                y = -ch / 2;
                angle = 0;
            }
            else if (k < cw + ch) {
                x = cw / 2;
                y = -ch / 2 + (k - cw);
                angle = p.HALF_PI;
            }
            else if (k < cw * 2 + ch) {
                x = cw / 2 - (k - (cw + ch));
                y = ch / 2;
                angle = p.PI;
            }
            else {
                x = -cw / 2;
                y = ch / 2 - (k - (cw * 2 + ch));
                angle = -p.HALF_PI;
            }

            const cornerDist = Math.min(tex.width, tex.height) * 0.02;
            if (cw - cornerDist < k && k < cw + cornerDist) {
                angle = p.map(k, cw - cornerDist, cw + cornerDist, 0, p.HALF_PI);
            }
            else if (cw + ch - cornerDist < k && k < cw + ch + cornerDist) {
                angle = p.map(k, cw + ch - cornerDist, cw + ch + cornerDist, p.HALF_PI, p.PI);
            }
            else if (cw * 2 + ch - cornerDist < k && k < cw * 2 + ch + cornerDist) {
                angle = p.map(k, cw * 2 + ch - cornerDist, cw * 2 + ch + cornerDist, p.PI, p.PI * 1.5);
            }
            else if (l - cornerDist < k || k < cornerDist) {
                angle = p.map(k < cornerDist ? k + l : k, l - cornerDist, l + cornerDist, p.PI * 1.5, p.TWO_PI);
            }

            tex.push();
            tex.textFont(font);
            tex.noStroke();
            tex.fill(255);
            tex.translate(x, y);
            tex.rotate(angle);
            tex.textAlign(p.CENTER, p.CENTER);
            tex.textSize(p.min(tex.width, tex.height) * 0.05);
            tex.text([...'Gigandect'][index], 0, 0);
            tex.pop();
        }
        tex.pop();
    }
    tex.pop();
}

const UIDraw07: UIDrawFunction = (p: p5, tex: p5.Graphics, font: p5.Font, _logo: p5.Image | undefined, _beat: number): void => {
    tex.clear();

    tex.push();
    tex.stroke(255);
    tex.noFill();
    tex.strokeWeight(2);
    tex.rectMode(p.CENTER);
    tex.rect(tex.width / 2, tex.height / 2, tex.width * 0.98, tex.height * 0.98);
    tex.pop();

    tex.push();
    tex.stroke(255);
    tex.noFill();
    tex.strokeWeight(4);
    tex.rect(tex.width * 0.025, tex.height * 0.82, tex.width * 0.95, tex.height * 0.15);
    tex.pop();

    // セリフ風テキスト表示
    const dialogues = [
        "Welcome to Gigandect Live...",
        "Maltine Records 20th Anniversary",
        "20Hour Event「CITY」 DAY",
        "Thank you!!",
    ];
    const charPerBeat = 8; // 1ビートあたりの文字数（早め）
    const pauseBeats = 8; // セリフ間の待機ビート数
    
    // 現在のセリフを計算
    const totalBeatsPerDialogue = (dialogues.reduce((max, d) => Math.max(max, d.length), 0) / charPerBeat) + pauseBeats;
    const dialogueIndex = Math.floor(_beat / totalBeatsPerDialogue) % dialogues.length;
    const currentDialogue = dialogues[dialogueIndex];
    const beatInDialogue = _beat % totalBeatsPerDialogue;
    
    const visibleChars = Math.floor(beatInDialogue * charPerBeat);
    const displayText = currentDialogue.substring(0, Math.min(visibleChars, currentDialogue.length));
    
    tex.push();
    tex.textFont(font);
    tex.textAlign(p.CENTER, p.CENTER);
    tex.fill(255);
    tex.noStroke();
    tex.textSize(tex.height * 0.06);
    
    const textY = tex.height * 0.9;
    tex.text(displayText, tex.width / 2, textY);
    
    // カーソル点滅（入力中のみ）
    if (visibleChars < currentDialogue.length && Math.floor(_beat * 4) % 2 === 0) {
        const cursorX = tex.width / 2 + tex.textWidth(displayText) / 2;
        tex.text("_", cursorX + tex.textWidth("_") / 2, textY);
    }
    tex.pop();

    tex.push();
    tex.textFont(font);
    tex.textAlign(p.RIGHT, p.TOP);
    tex.fill(255);
    tex.noStroke();
    tex.textSize(tex.height * 0.04);
    tex.text("vs.Gigandect", tex.width - tex.width * 0.025, tex.height * 0.05);
    tex.pop();

    tex.push();
    tex.textFont(font);
    tex.textAlign(p.LEFT, p.TOP);
    tex.fill(255);
    tex.noStroke();
    tex.textSize(tex.height * 0.04);
    tex.text(DateText.getYYYYMMDD_HHMMSS_format(), tex.width * 0.025, tex.height * 0.05);
    tex.pop();

    tex.push();
    tex.stroke(255);
    tex.noFill();
    tex.strokeWeight(2);
    tex.rect(tex.width - tex.width * 0.025 - tex.width * 0.2, tex.height * 0.1, tex.width * 0.2, tex.height * 0.02);

    const w = tex.width * map(GVM.leapNoise(_beat, 1.0, 0.5, Easing.easeInOutBack), 0, 1, 0, 0.2);
    tex.fill(255);
    tex.noStroke();
    tex.rect(tex.width - tex.width * 0.025 - w, tex.height * 0.1, w, tex.height * 0.02);
    tex.pop();
}


const UIDRAWERS: readonly UIDrawFunction[] = [
    UINone,
    UIDraw03,
    UIDraw02,
    UIDraw01,
    UIDraw07,
    UIDraw06,
    UIDraw05,
    UIDraw04,
];

// UIManager は単純なテキストオーバーレイの描画を担当する。
export class UIManager {
    private renderTexture: p5.Graphics | undefined;
    private activePatternIndex: number;

    /**
     * UIManagerクラスのコンストラクタです。
     * UI描画用のテクスチャ（Graphicsオブジェクト）の初期化状態を管理し、
     * 現在アクティブなUI描画パターンのインデックスを初期化します。
     * デフォルトではインデックス0（何も表示しないパターン）が選択されます。
     * このクラスは、複数のUIデザインを切り替えて表示するための管理機能を提供します。
     */
    constructor() {
        this.renderTexture = undefined;
        this.activePatternIndex = 0;
    }

    /**
     * UIマネージャーの初期化処理を行います。
     * p5.jsのインスタンスを使用して、画面サイズと同じ大きさの
     * オフスクリーンキャンバス（Graphicsオブジェクト）を作成します。
     * このキャンバスは、UI要素（テキスト、インジケーターなど）の描画先として使用され、
     * メインの描画ループで最終的な画面に重ね合わせられます。
     *
     * @param p p5.jsのインスタンス。
     */
    init(p: p5): void {
        this.renderTexture = p.createGraphics(p.width, p.height);
    }

    /**
     * 現在のUI描画用テクスチャを取得します。
     * このテクスチャには、現在選択されているUIパターンによって描画された
     * すべてのUI要素が含まれています。
     * テクスチャが未初期化の場合（init呼び出し前）はエラーをスローし、
     * 不正な状態での使用を防ぎます。
     *
     * @returns UI要素が描画されたp5.Graphicsオブジェクト。
     * @throws Error テクスチャが初期化されていない場合。
     */
    getTexture(): p5.Graphics {
        const texture = this.renderTexture;
        if (!texture) {
            throw new Error("Texture not initialized");
        }
        return texture;
    }

    /**
     * ウィンドウサイズ変更時に呼び出され、UI描画用テクスチャのサイズを更新します。
     * メインキャンバスのサイズ変更に合わせて、UI用のオフスクリーンキャンバスも
     * 同じサイズにリサイズします。
     * これにより、UI要素の配置やサイズが新しい画面サイズに対して
     * 適切に計算・描画されることを保証します。
     *
     * @param p p5.jsのインスタンス。
     */
    resize(p: p5): void {
        const texture = this.renderTexture;
        if (!texture) {
            throw new Error("Texture not initialized");
        }
        texture.resizeCanvas(p.width, p.height);
    }

    /**
     * 毎フレーム呼び出される更新処理です。
     * 外部からの入力パラメータ（主にMIDIコントローラーなどからの信号）を受け取り、
     * UIの状態を更新します。
     * 具体的には、パラメータ配列の最初の要素を使用して、
     * 表示すべきUIパターンのインデックスを決定・更新します。
     * これにより、演奏中に動的にUIのデザインを切り替えることが可能になります。
     *
     * @param _p p5.jsのインスタンス（現在未使用）。
     * @param params UI制御用のパラメータ配列。
     */
    update(_p: p5): void {
    }

    /**
     * UIの描画処理を実行します。
     * 現在アクティブなUIパターン（UIDRAWERS配列内の関数）を選択し、
     * 必要なリソース（テクスチャ、フォント、BPM情報など）を渡して実行します。
     * 描画前にはテクスチャのクリアとpush/popによる状態保存を行い、
     * 他の描画処理への影響を防ぎつつ、クリーンな状態でUIを描画します。
     *
     * @param p p5.jsのインスタンス。
     * @param font UI描画に使用するフォント。
     * @param resources その他の描画に必要なリソース群（BPM、ビート、カラーパレットなど）。
     */
    draw(p: p5, midiManager: APCMiniMK2Manager, font: p5.Font, logo: p5.Image | undefined): void {
        const texture = this.renderTexture;
        if (!texture) {
            throw new Error("Texture not initialized");
        }

        this.activePatternIndex = this.normalizePatternIndex(midiManager.midiInput["uiSelect"] as number | undefined);

        texture.push();
        texture.clear();
        const drawer = UIDRAWERS[this.activePatternIndex] ?? UIDRAWERS[0];
        drawer(p, texture, font, logo, p.millis() / 500);

        texture.pop();
    }

    /**
     * 入力されたパターンインデックスを正規化します。
     * 入力値が数値でない、または範囲外の場合に、
     * 安全なデフォルト値（0）や有効範囲内のインデックスに補正します。
     * これにより、不正な入力によるクラッシュやエラーを防ぎ、
     * 常に有効なUI描画関数が選択されることを保証します。
     *
     * @param value 正規化対象のインデックス値（undefinedの可能性あり）。
     * @returns 正規化された有効なインデックス整数。
     */
    private normalizePatternIndex(value: number | undefined): number {
        if (typeof value !== "number" || !Number.isFinite(value)) {
            return 0;
        }
        const clamped = Math.max(0, Math.floor(value));
        return Math.min(UIDRAWERS.length - 1, clamped);
    }
}