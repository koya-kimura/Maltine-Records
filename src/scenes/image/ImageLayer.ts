// ImageLayer は画像をテクスチャに描画し、シェーダーエフェクトを適用する共通レイヤー。
import p5 from "p5";

import { ImageRenderer } from "./ImageRenderer";

import { ImageAnimation } from "./ImageAnimation";
import { ImageGallery } from "./ImageGallery";

export class ImageLayer {
    private shader: p5.Shader | null;
    private sourceTexture: p5.Graphics | null;  // 画像を描画するテクスチャ
    private effectTexture: p5.Graphics | null;  // エフェクト適用後のテクスチャ
    private imageRenderer: ImageRenderer;
    private imageAnimation: ImageAnimation;
    private imageGallery: ImageGallery;

    /**
     * ImageLayerクラスのコンストラクタです。
     * 画像をテクスチャに焼き込み、シェーダーエフェクトを適用する共通レイヤーです。
     * 
     * @param textureWidth テクスチャの幅（デフォルト: 1024）
     * @param textureHeight テクスチャの高さ（デフォルト: 1024）
     */
    constructor() {
        this.shader = null;
        this.sourceTexture = null;
        this.effectTexture = null;
        this.imageRenderer = new ImageRenderer();
        this.imageAnimation = new ImageAnimation();
        this.imageGallery = new ImageGallery();
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
        await this.imageAnimation.load(p, "/image/hand", 5, 40);
        await this.imageGallery.load(p, "/image", [{ name: "animal", count: 3 }, { name: "human", count: 5 }, { name: "life", count: 4 }, { name: "noface", count: 4 }]);

        // エフェクト用のテクスチャを作成（WebGLモード）
        this.sourceTexture = p.createGraphics(p.width, p.height);
        this.effectTexture = p.createGraphics(p.width, p.height, p.WEBGL);
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
     */
    draw(p: p5, tex: p5.Graphics, sceneIndex: number, beat: number): void {
        if (!this.effectTexture || !this.shader || !this.sourceTexture) {
            return;
        }
        
        // 1. 画像をsourceTextureに描画（アスペクト比を保持）
        this.sourceTexture.push();
        this.sourceTexture.clear();

        // モードが引数になる予定
        this.imageRenderer.draw(p, this.sourceTexture, this.imageAnimation, this.imageGallery, beat, sceneIndex);

        this.sourceTexture.pop();

        // 2. シェーダーを適用してeffectTextureに描画
        this.effectTexture.push();
        this.effectTexture.clear();
        this.effectTexture.shader(this.shader);

        // シェーダーにUniform変数を設定
        this.shader.setUniform("u_tex", this.sourceTexture);
        this.shader.setUniform("u_resolution", [this.sourceTexture.width, this.sourceTexture.height]);
        this.shader.setUniform("u_isLife", 0);

        // WEBGLモードは中心原点なので、中心から描画
        this.effectTexture.rect(0, 0, this.effectTexture.width, this.effectTexture.height);
        this.effectTexture.pop();

        tex.push();
        tex.image(this.effectTexture, 0, 0);
        tex.pop();
    }

    resize(p: p5): void {
        this.sourceTexture?.resizeCanvas(p.width, p.height);
        this.effectTexture?.resizeCanvas(p.width, p.height);
    }
}
