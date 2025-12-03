// Pattern は模様を生成するためのシェーダーベースのテクスチャジェネレータ。
// モード名を受け取り、対応するパターンを描画する。
import p5 from "p5";

export class Pattern {
    private shader: p5.Shader | null;
    private patternTexture: p5.Graphics | null;

    /**
     * Patternクラスのコンストラクタです。
     * 
     * @param width パターンテクスチャの幅（デフォルト: 512）
     * @param height パターンテクスチャの高さ（デフォルト: 512）
     */
    constructor() {
        this.shader = null;
        this.patternTexture = null;
    }

    /**
     * pattern.fragシェーダーファイルを非同期で読み込み、
     * パターン生成用のテクスチャ（p5.Graphics）を初期化します。
     * 
     * @param p p5.jsのインスタンス。
     * @param vertPath 頂点シェーダーファイルのパス（.vert）。
     * @param fragPath フラグメントシェーダーファイルのパス（.frag）。
     * @returns シェーダーの読み込みが完了した後に解決されるPromise。
     */
    async load(p: p5, vertPath: string, fragPath: string): Promise<void> {
        this.patternTexture = p.createGraphics(p.width, p.height, p.WEBGL);
        const shaderOrPromise = p.loadShader(vertPath, fragPath);

        if (shaderOrPromise instanceof Promise) {
            this.shader = await shaderOrPromise;
        } else {
            this.shader = shaderOrPromise;
        }
    }

    /**
     * シェーダーを使用してパターンテクスチャを更新します。
     * 
     * @param p p5.jsのインスタンス。
     * @param modeName モード名。
     * @param beat 現在のビート情報。
     */
    update(p: p5, beat: number = 0): void {
        if (!this.shader || !this.patternTexture) {
            return;
        }

        this.patternTexture.push();
        this.patternTexture.shader(this.shader);

        // シェーダーにUniform変数を設定
        this.shader.setUniform("u_beat", beat);
        this.shader.setUniform("u_resolution", [p.width, p.height]);
        this.shader.setUniform("u_time", p.millis() / 1000.0);
        this.shader.setUniform("u_patternIndex", 0);
        // カラーのuniformを設定（一旦黒と緑）
        this.shader.setUniform("u_mainColor", [0.0, 1.0, 0.0]); // 緑
        this.shader.setUniform("u_subColor", [0.0, 0.0, 0.0]);  // 黒

        // テクスチャ全体にシェーダーを適用
        this.patternTexture.rect(0, 0, p.width, p.height);
        this.patternTexture.pop();
    }

    /**
     * モード名に応じてパターンを描画
     */
    draw(
        p: p5 | p5.Graphics,
        beat: number = 0
    ): void {
        if (!this.patternTexture) return;

        p.push();
        p.image(this.patternTexture, 0, 0);
        p.pop();
    }

    /**
     * パターンテクスチャのサイズを変更します。
     */
    resize(p: p5): void {
        this.patternTexture?.resizeCanvas(p.width, p.height);
    }
}
