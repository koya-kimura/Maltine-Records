// ImageRenderer は画像の描画処理を管理するクラス。
// モード名を受け取り、サイズ変更、複数表示、動きなどの描画処理を行う。
import p5 from "p5";
import { ImageAnimation } from "./ImageAnimation";
import { ImageGallery } from "./ImageGallery";

/**
 * ImageRendererクラス
 * モード名に応じて画像の描画処理を行う
 */
export class ImageRenderer {

    /**
     * モード名に応じて画像を描画
     * @param p 描画先
     * @param modeName モード名
     */
    draw(
        p: p5 | p5.Graphics,
        imageAnimation: ImageAnimation,
        beat: number,
        sceneIndex: number,
    ): void {
        const img = imageAnimation.getImage(0, (beat * 0.1) % 1);
        if (!img) {
            return;
        }
        img.resize(p.width, 0);

        p.push();
        p.imageMode(p.CENTER);
        p.image(img, 0, 0);

        p.pop();
    }
}