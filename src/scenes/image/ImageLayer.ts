// ImageLayer は画像をテクスチャに描画し、シェーダーエフェクトを適用する共通レイヤー。
import p5 from "p5";

export class ImageLayer {
    private shader: p5.Shader | null;
    private sourceTexture: p5.Graphics | null;  // 画像を描画するテクスチャ
    private effectTexture: p5.Graphics | null;  // エフェクト適用後のテクスチャ
    private textureWidth: number;
    private textureHeight: number;

    /**
     * ImageLayerクラスのコンストラクタです。
     * 画像をテクスチャに焼き込み、シェーダーエフェクトを適用する共通レイヤーです。
     * 
     * @param textureWidth テクスチャの幅（デフォルト: 1024）
     * @param textureHeight テクスチャの高さ（デフォルト: 1024）
     */
    constructor(textureWidth: number = 1024, textureHeight: number = 1024) {
        this.shader = null;
        this.sourceTexture = null;
        this.effectTexture = null;
        this.textureWidth = textureWidth;
        this.textureHeight = textureHeight;
    }

    /**
     * シェーダーとテクスチャを初期化します。
     * 
     * @param p p5.jsのインスタンス
     */
    async load(p: p5): Promise<void> {
        // エフェクト用のシェーダーを読み込み
        const shaderOrPromise = p.loadShader("/shader/main.vert", "/shader/imageMono.frag");
        if (shaderOrPromise instanceof Promise) {
            this.shader = await shaderOrPromise;
        } else {
            this.shader = shaderOrPromise;
        }

        // エフェクト用のテクスチャを作成（WebGLモード）
        this.sourceTexture = p.createGraphics(this.textureWidth, this.textureHeight);
        this.effectTexture = p.createGraphics(this.textureWidth, this.textureHeight, p.WEBGL);
    }

    /**
     * 画像をテクスチャに描画し、エフェクトを適用します。
     * アスペクト比を保持したまま描画します。
     * 
     * @param p p5.jsのインスタンス
     * @param image 描画する画像
     */
    updateWithImage(p: p5, image: p5.Image | null): void {
        if (!image || !this.sourceTexture || !this.effectTexture || !this.shader) {
            // 画像がない場合はクリア
            if (this.effectTexture) {
                this.effectTexture.clear();
            }
            return;
        }

        // 1. 画像をsourceTextureに描画（アスペクト比を保持）
        this.sourceTexture.push();
        this.sourceTexture.clear();
        this.sourceTexture.imageMode(p.CENTER);

        // アスペクト比を計算
        const imageAspect = image.width / image.height;
        const textureAspect = this.textureWidth / this.textureHeight;

        let drawWidth: number;
        let drawHeight: number;

        if (imageAspect > textureAspect) {
            // 画像の方が横長 → 幅を基準に
            drawWidth = this.textureWidth;
            drawHeight = this.textureWidth / imageAspect;
        } else {
            // 画像の方が縦長（or同じ） → 高さを基準に
            drawHeight = this.textureHeight;
            drawWidth = this.textureHeight * imageAspect;
        }

        this.sourceTexture.image(image, this.textureWidth / 2, this.textureHeight / 2, drawWidth, drawHeight);
        this.sourceTexture.pop();

        // 2. シェーダーを適用してeffectTextureに描画
        this.effectTexture.push();
        this.effectTexture.clear();
        this.effectTexture.shader(this.shader);

        // シェーダーにUniform変数を設定
        this.shader.setUniform("u_tex", this.sourceTexture);
        this.shader.setUniform("u_resolution", [this.textureWidth, this.textureHeight]);

        // テクスチャ全体にシェーダーを適用
        this.effectTexture.rect(0, 0, this.textureWidth, this.textureHeight);
        this.effectTexture.pop();
    }

    /**
     * エフェクト適用後のテクスチャを取得します。
     * 
     * @returns エフェクト適用後のp5.Graphicsオブジェクト
     */
    getTexture(): p5.Graphics | null {
        return this.effectTexture;
    }

    /**
     * エフェクト適用後のテクスチャを指定した座標に描画します。
     * 
     * @param p p5.jsのインスタンス、またはp5.Graphicsオブジェクト。
     * @param x 描画位置のX座標。
     * @param y 描画位置のY座標。
     * @param w 描画する幅（省略可能）。
     * @param h 描画する高さ（省略可能）。
     */
    draw(p: p5 | p5.Graphics, x: number, y: number, w?: number, h?: number): void {
        if (!this.effectTexture) {
            return;
        }

        if (w !== undefined && h !== undefined) {
            p.image(this.effectTexture, x, y, w, h);
        } else {
            p.image(this.effectTexture, x, y);
        }
    }
}
