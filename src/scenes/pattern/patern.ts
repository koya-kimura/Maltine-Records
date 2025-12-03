// Pattern は模様を生成するためのシェーダーベースのテクスチャジェネレータ。
import p5 from "p5";

export class Pattern {
    private shader: p5.Shader | null;
    private patternTexture: p5.Graphics | null;
    private patternWidth: number;
    private patternHeight: number;
    private patternType: number; // 0: 縞模様, 1: 水玉, 2: 円, 3: グリッド
    private maskType: number;    // 0: なし, 1: 四角形, 2: 円

    /**
     * Patternクラスのコンストラクタです。
     * シェーダーとテクスチャの初期化（null設定）を行います。
     * デフォルトで512x512のテクスチャサイズを設定しますが、
     * コンストラクタの引数で任意のサイズを指定することも可能です。
     * 
     * @param width パターンテクスチャの幅（デフォルト: 512）
     * @param height パターンテクスチャの高さ（デフォルト: 512）
     * @param patternType 模様の種類（デフォルト: 0 = 縞模様）
     * @param maskType マスクの種類（デフォルト: 0 = なし）
     */
    constructor(width: number = 512, height: number = 512, patternType: number = 0, maskType: number = 0) {
        this.shader = null;
        this.patternTexture = null;
        this.patternWidth = width;
        this.patternHeight = height;
        this.patternType = patternType;
        this.maskType = maskType;
    }

    /**
     * pattern.fragシェーダーファイルを非同期で読み込み、
     * パターン生成用のテクスチャ（p5.Graphics）を初期化します。
     * p5.jsのloadShader関数を使用し、シェーダーオブジェクトを作成してクラス内部に保持します。
     * また、WebGLモードでパターン描画用のGraphicsオブジェクトを作成します。
     * 
     * @param p p5.jsのインスタンス。シェーダーのロード機能を提供します。
     * @param vertPath 頂点シェーダーファイルのパス（.vert）。
     * @param fragPath フラグメントシェーダーファイルのパス（.frag）。
     * @returns シェーダーの読み込みが完了した後に解決されるPromise。
     */
    async load(p: p5, vertPath: string, fragPath: string): Promise<void> {
        const shaderOrPromise = p.loadShader(vertPath, fragPath);

        if (shaderOrPromise instanceof Promise) {
            this.shader = await shaderOrPromise;
        } else {
            this.shader = shaderOrPromise;
        }

        // WebGLモードでパターン描画用のGraphicsを作成
        this.patternTexture = p.createGraphics(this.patternWidth, this.patternHeight, p.WEBGL);
    }

    /**
     * シェーダーを使用してパターンテクスチャを更新します。
     * シェーダーにビート情報や時間などのUniform変数を設定し、
     * テクスチャ全体に対してシェーダーを適用することで、
     * 水玉模様などの動的なパターンを生成します。
     * 
     * @param p p5.jsのインスタンス。
     * @param beat 現在のビート情報。リズムに合わせたパターン変化に使用。
     */
    update(p: p5, beat: number = 0): void {
        if (!this.shader || !this.patternTexture) {
            return;
        }

        this.patternTexture.push();
        this.patternTexture.shader(this.shader);

        // シェーダーにUniform変数を設定
        this.shader.setUniform("u_beat", beat);
        this.shader.setUniform("u_resolution", [this.patternWidth, this.patternHeight]);
        this.shader.setUniform("u_time", p.millis() / 1000.0);
        this.shader.setUniform("u_patternType", this.patternType);
        this.shader.setUniform("u_maskType", this.maskType);

        // カラーのuniformを設定（一旦黒と緑）
        this.shader.setUniform("u_mainColor", [0.0, 1.0, 0.0]); // 緑
        this.shader.setUniform("u_subColor", [0.0, 0.0, 0.0]);  // 黒

        // テクスチャ全体にシェーダーを適用
        this.patternTexture.rect(0, 0, this.patternWidth, this.patternHeight);
        this.patternTexture.pop();
    }

    /**
     * 生成されたパターンテクスチャを取得します。
     * このテクスチャはp5.Graphicsオブジェクトで、
     * image()関数などで描画に使用できます。
     * 
     * @returns パターンが描画されたp5.Graphicsオブジェクト。
     * @throws Error テクスチャが初期化されていない場合。
     */
    getTexture(): p5.Graphics {
        if (!this.patternTexture) {
            throw new Error("Pattern texture not initialized");
        }
        return this.patternTexture;
    }

    /**
     * パターンテクスチャを指定した座標に描画します。
     * 内部でp5.image()を使用して、生成されたパターンを描画します。
     * 
     * @param p p5.jsのインスタンス、またはp5.Graphicsオブジェクト。
     * @param x 描画位置のX座標。
     * @param y 描画位置のY座標。
     * @param w 描画する幅（省略可能、省略時はテクスチャの元のサイズ）。
     * @param h 描画する高さ（省略可能、省略時はテクスチャの元のサイズ）。
     */
    drawPattern(p: p5 | p5.Graphics, x: number, y: number, w?: number, h?: number): void {
        if (!this.patternTexture) {
            throw new Error("Pattern texture not initialized");
        }

        if (w !== undefined && h !== undefined) {
            p.image(this.patternTexture, x, y, w, h);
        } else {
            p.image(this.patternTexture, x, y);
        }
    }

    /**
     * 模様の種類を設定します。
     * 
     * @param type 0: 縞模様, 1: 水玉, 2: 円, 3: グリッド
     */
    setPatternType(type: number): void {
        this.patternType = type;
    }

    /**
     * マスクの種類を設定します。
     * 
     * @param type 0: なし（全体）, 1: 四角形, 2: 円
     */
    setMaskType(type: number): void {
        this.maskType = type;
    }

    /**
     * 現在の模様の種類を取得します。
     * 
     * @returns 模様の種類
     */
    getPatternType(): number {
        return this.patternType;
    }

    /**
     * 現在のマスクの種類を取得します。
     * 
     * @returns マスクの種類
     */
    getMaskType(): number {
        return this.maskType;
    }

    /**
     * パターンテクスチャのサイズを変更します。
     * テクスチャを再作成することで、新しいサイズに対応します。
     * 
     * @param p p5.jsのインスタンス。
     * @param width 新しい幅。
     * @param height 新しい高さ。
     */
    resize(p: p5, width: number, height: number): void {
        this.patternWidth = width;
        this.patternHeight = height;

        if (this.patternTexture) {
            // 既存のテクスチャを削除して新しいサイズで作成
            this.patternTexture.remove();
            this.patternTexture = p.createGraphics(this.patternWidth, this.patternHeight, p.WEBGL);
        }
    }
}
