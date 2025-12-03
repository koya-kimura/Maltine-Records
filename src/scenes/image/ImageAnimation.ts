// ImageAnimation は連番画像をGIFのようにアニメーション再生するクラス。
import p5 from "p5";

export class ImageAnimation {
    private images: p5.Image[][];
    private currentAnimationIndex: number;
    private currentFrameIndex: number;
    private frameRate: number;
    private lastFrameTime: number;
    private isLoaded: boolean;

    // エフェクト用
    private shader: p5.Shader | null;
    private sourceTexture: p5.Graphics | null;  // 画像を描画するテクスチャ
    private effectTexture: p5.Graphics | null;  // エフェクト適用後のテクスチャ
    private textureWidth: number;
    private textureHeight: number;

    /**
     * ImageAnimationクラスのコンストラクタです。
     * 連番画像を読み込んでアニメーション再生する機能を提供します。
     * 
     * @param frameRate 1秒あたりのフレーム数（デフォルト: 30fps）
     * @param textureWidth エフェクト用テクスチャの幅（デフォルト: 1024）
     * @param textureHeight エフェクト用テクスチャの高さ（デフォルト: 1024）
     */
    constructor(frameRate: number = 30, textureWidth: number = 1024, textureHeight: number = 1024) {
        this.images = [];
        this.currentAnimationIndex = 0;
        this.currentFrameIndex = 0;
        this.frameRate = frameRate;
        this.lastFrameTime = 0;
        this.isLoaded = false;

        this.shader = null;
        this.sourceTexture = null;
        this.effectTexture = null;
        this.textureWidth = textureWidth;
        this.textureHeight = textureHeight;
    }

    /**
     * 指定されたディレクトリから連番画像を非同期で読み込みます。
     * 5つのアニメーションセット（1-5）のそれぞれから連番画像を読み込みます。
     * また、エフェクト用のシェーダーとテクスチャも初期化します。
     * 
     * @param p p5.jsのインスタンス。画像のロード機能を提供します。
     * @param basePath 画像ディレクトリのベースパス（例: "/image/hand"）
     * @param animationCount アニメーションセットの数（デフォルト: 5）
     * @param framesPerAnimation 各アニメーションのフレーム数（デフォルト: 40）
     */
    async load(
        p: p5,
        basePath: string,
        animationCount: number = 5,
        framesPerAnimation: number = 40
    ): Promise<void> {
        const loadPromises: Promise<void>[] = [];

        for (let animIndex = 1; animIndex <= animationCount; animIndex++) {
            this.images[animIndex - 1] = [];

            for (let frameIndex = 1; frameIndex <= framesPerAnimation; frameIndex++) {
                const imagePath = `${basePath}/${animIndex}/${frameIndex}.png`;

                const promise = new Promise<void>((resolve) => {
                    p.loadImage(
                        imagePath,
                        (img) => {
                            this.images[animIndex - 1][frameIndex - 1] = img;
                            resolve();
                        },
                        () => {
                            // エラーハンドリング: 読み込み失敗時は空の画像として扱う
                            console.warn(`Failed to load image: ${imagePath}`);
                            resolve();
                        }
                    );
                });

                loadPromises.push(promise);
            }
        }

        await Promise.all(loadPromises);

        // エフェクト用のシェーダーを読み込み
        const shaderOrPromise = p.loadShader("/shader/main.vert", "/shader/imageMono.frag");
        if (shaderOrPromise instanceof Promise) {
            this.shader = await shaderOrPromise;
        } else {
            this.shader = shaderOrPromise;
        }

        // エフェクト用のテクスチャを作成（WebGLモード）
        this.sourceTexture = p.createGraphics(this.textureWidth, this.textureHeight, p.WEBGL);
        this.effectTexture = p.createGraphics(this.textureWidth, this.textureHeight, p.WEBGL);

        this.isLoaded = true;
        console.log(`Loaded ${animationCount} animations with ${framesPerAnimation} frames each`);
    }

    /**
     * 現在のフレームを更新します。
     * 時間経過に応じて次のフレームに進みます。
     * 
     * @param p p5.jsのインスタンス。現在の時間を取得するために使用します。
     */
    update(p: p5): void {
        if (!this.isLoaded || this.images.length === 0) {
            return;
        }

        const currentTime = p.millis();
        const frameDuration = 1000 / this.frameRate;

        if (currentTime - this.lastFrameTime >= frameDuration) {
            this.lastFrameTime = currentTime;

            // 次のフレームに進む
            this.currentFrameIndex++;

            const currentAnimation = this.images[this.currentAnimationIndex];
            if (currentAnimation && this.currentFrameIndex >= currentAnimation.length) {
                this.currentFrameIndex = 0; // ループ再生
            }
        }

        // エフェクトの更新
        this.updateEffect(p);
    }

    /**
     * エフェクトを更新します。
     * 1. 画像をsourceTextureに描画
     * 2. シェーダーを適用してeffectTextureに描画
     * 
     * @param p p5.jsのインスタンス
     */
    private updateEffect(p: p5): void {
        const currentFrame = this.getCurrentFrame();
        if (!currentFrame || !this.sourceTexture || !this.effectTexture || !this.shader) {
            return;
        }

        // 1. 画像をsourceTextureに描画
        this.sourceTexture.push();
        this.sourceTexture.clear();
        this.sourceTexture.imageMode(p.CENTER);
        this.sourceTexture.image(currentFrame, 0, 0);
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
     * 現在のフレーム画像を取得します。
     * 
     * @returns 現在のフレームのp5.Imageオブジェクト、または未ロード時はnull
     */
    getCurrentFrame(): p5.Image | null {
        if (!this.isLoaded || this.images.length === 0) {
            return null;
        }

        const currentAnimation = this.images[this.currentAnimationIndex];
        if (!currentAnimation || currentAnimation.length === 0) {
            return null;
        }

        return currentAnimation[this.currentFrameIndex] || null;
    }

    /**
     * エフェクト適用後のテクスチャを取得します。
     * 
     * @returns エフェクト適用後のp5.Graphicsオブジェクト
     */
    getEffectTexture(): p5.Graphics | null {
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

    /**
     * 再生するアニメーションセットを切り替えます。
     * 
     * @param index アニメーションセットのインデックス（0-4）
     */
    setAnimationIndex(index: number): void {
        if (index >= 0 && index < this.images.length) {
            this.currentAnimationIndex = index;
            this.currentFrameIndex = 0; // フレームをリセット
        }
    }

    /**
     * 現在のアニメーションセットのインデックスを取得します。
     * 
     * @returns 現在のアニメーションセットのインデックス
     */
    getAnimationIndex(): number {
        return this.currentAnimationIndex;
    }

    /**
     * フレームレートを設定します。
     * 
     * @param fps 1秒あたりのフレーム数
     */
    setFrameRate(fps: number): void {
        this.frameRate = fps;
    }

    /**
     * アニメーションが読み込み完了しているかを確認します。
     * 
     * @returns 読み込み完了している場合はtrue
     */
    isReady(): boolean {
        return this.isLoaded;
    }
}
