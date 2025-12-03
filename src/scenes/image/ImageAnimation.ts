// ImageAnimation は連番画像を管理するクラス。
// アニメーションインデックスとフレーム番号を指定すると画像を返す。
import p5 from "p5";

export class ImageAnimation {
    private images: p5.Image[][];

    constructor() {
        this.images = [];
    }

    /**
     * 指定されたディレクトリから連番画像を非同期で読み込みます。
     * 
     * @param p p5.jsのインスタンス
     * @param basePath 画像ディレクトリのベースパス（例: "/image/hand"）
     * @param animationCount アニメーションセットの数
     * @param framesPerAnimation 各アニメーションのフレーム数
     */
    async load(
        p: p5,
        basePath: string,
        animationCount: number,
        framesPerAnimation: number
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
                            console.warn(`Failed to load image: ${imagePath}`);
                            resolve();
                        }
                    );
                });

                loadPromises.push(promise);
            }
        }

        await Promise.all(loadPromises);
        console.log(`Loaded ${animationCount} animations with ${framesPerAnimation} frames each`);
    }

    /**
     * 指定したアニメーションインデックスとフレーム番号の画像を取得
     * 
     * @param animationIndex アニメーションインデックス（0始まり）
     * @param frameIndex フレーム番号（0始まり）
     * @returns p5.Imageオブジェクト、またはnull
     */
    getImage(animationIndex: number, frameIndex: number): p5.Image | null {
        const animation = this.images[animationIndex];
        if (!animation) return null;
        return animation[frameIndex] || null;
    }

    /**
     * 指定したアニメーションのフレーム数を取得
     */
    getFrameCount(animationIndex: number): number {
        return this.images[animationIndex]?.length || 0;
    }

    /**
     * アニメーション数を取得
     */
    getAnimationCount(): number {
        return this.images.length;
    }
}
