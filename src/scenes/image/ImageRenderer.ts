// ImageRenderer は画像の描画処理を管理するクラス。
// モード名を受け取り、サイズ変更、複数表示、動きなどの描画処理を行う。
import p5 from "p5";
import { ImageAnimation } from "./ImageAnimation";
import { ImageGallery } from "./ImageGallery";
import { Easing } from "../../utils/easing";
import { fract } from "../../utils/mathUtils";
import { UniformRandom } from "../../utils/uniformRandom";

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
        p: p5,
        tex: p5.Graphics,
        imageAnimation: ImageAnimation,
        imageGallery: ImageGallery,
        beat: number,
        sceneIndex: number,
    ): void {

        if (sceneIndex === 0) {
            tex.push();
            tex.clear();
            tex.pop();
        }
        else if (sceneIndex === 1) {
            const img = imageGallery.getImage("noface", Math.floor((beat * 0.2) % 4))!;

            tex.push();
            tex.imageMode(p.CENTER);
            tex.translate(tex.width / 2, tex.height * 0.6);
            tex.scale(0.85);
            tex.image(img, 0, 0);
            tex.pop();
        }
        else if (sceneIndex === 2) {
            const img = imageGallery.getImage("animal", 0)!;

            tex.push();
            tex.imageMode(p.CENTER);
            tex.translate(tex.width * 0.25, tex.height * 0.65);
            tex.scale(0.6);
            tex.image(img, 0, 0);
            tex.pop();
        }
        else if (sceneIndex === 3) {
            const img = imageGallery.getImage("animal", 1)!;

            tex.push();
            tex.imageMode(p.CENTER);
            tex.translate(tex.width * 0.25, tex.height * 0.55);
            tex.scale(1.5);
            tex.image(img, 0, 0);
            tex.pop();
        }
        else if (sceneIndex === 4) {
            const img = imageGallery.getImage("animal", 2)!;

            tex.push();
            tex.imageMode(p.CENTER);

            tex.push();
            tex.translate(tex.width * 0.05, tex.height * 0.5);
            tex.scale(1.2);
            tex.image(img, 0, 0);
            tex.pop();

            tex.push();
            tex.translate(tex.width * 0.95, tex.height * 0.5);
            tex.scale(-1, 1);
            tex.scale(1.2);
            tex.image(img, 0, 0);
            tex.pop();
            tex.pop();
        }
        else if (sceneIndex === 5) {
            const img = imageGallery.getImage("human", 0);  // animalは0,1,2の3枚

            tex.push();
            tex.imageMode(p.CENTER);
            tex.translate(tex.width * 0.5, tex.height * 0.5);
            tex.scale(1.2);
            tex.image(img, 0, 0);
            tex.pop();

            const hand = imageAnimation.getImage("hand", 2, Easing.zigzag(beat * 0.3));

            tex.push();
            tex.imageMode(p.CENTER);
            tex.translate(tex.width * 0.55, tex.height * 0.5);
            tex.scale(1.2);
            tex.image(hand, 0, 0);
            tex.pop();
        }
        else if (sceneIndex === 6) {
            const img = imageGallery.getImage("human", 1);  // animalは0,1,2の3枚

            tex.push();
            tex.imageMode(p.CENTER);
            tex.translate(tex.width * 0.5, tex.height * 0.9);
            tex.scale(2.5);
            tex.image(img, 0, 0);
            tex.pop();
        }
        else if (sceneIndex === 7) {
            const img = imageGallery.getImage("human", 2);  // animalは0,1,2の3枚

            tex.push();
            tex.imageMode(p.CENTER);
            tex.translate(tex.width * 0.8, tex.height * 0.7);
            tex.rotate(Math.PI * 0.1)
            tex.scale(0.7);
            tex.image(img, 0, 0);
            tex.pop();
        }
        else if (sceneIndex === 8) {
            const img = imageGallery.getImage("human", 3);  // animalは0,1,2の3枚

            tex.push();
            tex.imageMode(p.CENTER);
            tex.translate(tex.width * 0.5, tex.height * 0.7);
            tex.scale(1.5);
            tex.image(img, 0, 0);
            tex.pop();
        }
        else if (sceneIndex === 9) {
            tex.push();

            for(let i = 0; i < 3; i++){
                const walk = imageAnimation.getImage("walk", Math.floor(UniformRandom.rand(Math.floor(beat*2), i*45782)*4), Easing.zigzag(beat * 0.1));
                const x = tex.width * 0.15 + i * tex.width * 0.35;
                tex.push();
                tex.imageMode(p.CENTER);
                tex.translate(x, tex.height * 0.7);
                tex.scale(1.3);
                tex.image(walk, 0, 0);
                tex.pop();
            }
            tex.pop();
        }
        else if (sceneIndex === 10) {
            const img = imageGallery.getImage("human", 4);  // animalは0,1,2の3枚

            tex.push();
            tex.imageMode(p.CENTER);
            tex.translate(tex.width * 0.5, tex.height * 0.7);
            tex.scale(1.2);
            tex.image(img, 0, 0);
            tex.pop();
        }
    }
}