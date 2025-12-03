import p5 from "p5";
import { DateText } from "../utils/dateText";
import { Easing } from "../utils/easing";

type UIDrawFunction = (p: p5, tex: p5.Graphics, font: p5.Font, beat: number) => void;

/**
 * UI描画関数その2（インデックス1）。
 * メインのビジュアルオーバーレイとして機能し、以下の要素を描画します：
 * 1. 中央にアーティスト名（TAKASHIMA & KIMURA）
 * 2. 上下に流れる「OVER!FLOW」のテキストアニメーション
 * 3. 右下に現在のBPMと日付・時刻
 * 4. ビートに合わせて動くインジケーター（矩形）
 * これらはすべてオフスクリーンキャンバス（tex）に描画され、
 * 最終的にメインキャンバスに合成されます。
 *
 * @param context 描画に必要なコンテキスト情報。
 */
const UIDraw01: UIDrawFunction = (p: p5, tex: p5.Graphics, font: p5.Font, beat: number): void => {
    tex.push();
    tex.textFont(font);

    // Maltine Records のテキスト（各文字の後ろに黒い四角形）
    const titleText = "Maltine Records";
    const titleSize = tex.width * 0.04;
    tex.textSize(titleSize);
    tex.textAlign(p.CENTER, p.CENTER);

    // 各文字の幅を計算してトータル幅を求める
    const charWidths: number[] = [];
    const letterSpacing = titleSize * 0.2; // 文字間スペース
    let totalWidth = 0;
    for (const char of titleText) {
        const w = tex.textWidth(char);
        charWidths.push(w);
        totalWidth += w;
    }
    totalWidth += letterSpacing * (titleText.length - 1); // 文字間を追加

    // 開始X座標（中央揃えのため）
    let currentX = tex.width * 0.5 - totalWidth / 2;
    const titleY = tex.height * 0.1;
    const padding = titleSize * 0.15;

    // 各文字を描画
    for (let i = 0; i < titleText.length; i++) {
        const char = titleText[i];
        const charWidth = charWidths[i];
        const charCenterX = currentX + charWidth / 2;

        // 黒い四角形（文字の後ろ）
        tex.noStroke();
        tex.fill(0);
        tex.rectMode(p.CENTER);
        tex.rect(charCenterX, titleY, charWidth + padding, titleSize + padding);

        // 白い文字
        tex.fill(255);
        tex.noStroke();
        tex.text(char, charCenterX, titleY);

        currentX += charWidth + letterSpacing;
    }

    const dateTimeString = DateText.getYYYYMMDD_HHMMSS_format();

    tex.textSize(tex.width * 0.015);
    tex.textAlign(p.RIGHT, p.BOTTOM);
    tex.noStroke();
    tex.fill(255);
    tex.text(dateTimeString, tex.width * 0.95, tex.height * 0.95);

    tex.stroke(255);
    tex.strokeWeight(2);
    tex.line(tex.width * 0.05, tex.height * 0.1, tex.width * 0.3, tex.height * 0.1);
    tex.line(tex.width * 0.7, tex.height * 0.1, tex.width * 0.95, tex.height * 0.1);

    tex.pop();
}

const UIDRAWERS: readonly UIDrawFunction[] = [
    UIDraw01,
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
    draw(p: p5, font: p5.Font): void {
        const texture = this.renderTexture;
        if (!texture) {
            throw new Error("Texture not initialized");
        }

        texture.push();
        texture.clear();
        const drawer = UIDRAWERS[this.activePatternIndex] ?? UIDRAWERS[0];
        drawer(p, texture, font, p.millis() / 500);

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