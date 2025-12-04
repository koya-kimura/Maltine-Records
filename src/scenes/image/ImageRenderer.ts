// ImageRenderer は画像の描画処理を管理するクラス。
// モード名を受け取り、サイズ変更、複数表示、動きなどの描画処理を行う。
import p5 from "p5";
import { ImageAnimation } from "./ImageAnimation";
import { ImageGallery } from "./ImageGallery";
import { Easing } from "../../utils/easing";
import { UniformRandom } from "../../utils/uniformRandom";

// 画像描画コンテキストの型定義
interface ImageDrawContext {
    p: p5;
    tex: p5.Graphics;
    imageAnimation: ImageAnimation;
    imageGallery: ImageGallery;
    beat: number;
}

// 画像描画関数の型定義
type ImageDrawFn = (ctx: ImageDrawContext) => void;

// シーン描画関数の配列
const imageScenes: ImageDrawFn[] = [
    // scene 0: empty
    (ctx) => {
        ctx.tex.clear();
    },

    // scene 1: noface cycling
    (ctx) => {
        const img = ctx.imageGallery.getImage("noface", Math.floor((ctx.beat * 0.2) % 4));
        ctx.tex.push();
        ctx.tex.imageMode(ctx.p.CENTER);
        ctx.tex.translate(ctx.tex.width / 2, ctx.tex.height * 0.6);
        ctx.tex.scale(0.85);
        ctx.tex.image(img, 0, 0);
        ctx.tex.pop();
    },

    // scene 2: animal 0
    (ctx) => {
        const img = ctx.imageGallery.getImage("animal", 0);
        ctx.tex.push();
        ctx.tex.imageMode(ctx.p.CENTER);
        ctx.tex.translate(ctx.tex.width * 0.25, ctx.tex.height * 0.65);
        ctx.tex.scale(0.6);
        ctx.tex.image(img, 0, 0);
        ctx.tex.pop();
    },

    // scene 3: animal 1
    (ctx) => {
        const img = ctx.imageGallery.getImage("animal", 1);
        ctx.tex.push();
        ctx.tex.imageMode(ctx.p.CENTER);
        ctx.tex.translate(ctx.tex.width * 0.25, ctx.tex.height * 0.55);
        ctx.tex.scale(1.5);
        ctx.tex.image(img, 0, 0);
        ctx.tex.pop();
    },

    // scene 4: animal 2 mirrored
    (ctx) => {
        const img = ctx.imageGallery.getImage("animal", 2);
        ctx.tex.push();
        ctx.tex.imageMode(ctx.p.CENTER);

        ctx.tex.push();
        ctx.tex.translate(ctx.tex.width * 0.05, ctx.tex.height * 0.5);
        ctx.tex.scale(1.2);
        ctx.tex.image(img, 0, 0);
        ctx.tex.pop();

        ctx.tex.push();
        ctx.tex.translate(ctx.tex.width * 0.95, ctx.tex.height * 0.5);
        ctx.tex.scale(-1, 1);
        ctx.tex.scale(1.2);
        ctx.tex.image(img, 0, 0);
        ctx.tex.pop();
        ctx.tex.pop();
    },

    // scene 5: human 0 with hand animation
    (ctx) => {
        const img = ctx.imageGallery.getImage("human", 0);
        ctx.tex.push();
        ctx.tex.imageMode(ctx.p.CENTER);
        ctx.tex.translate(ctx.tex.width * 0.5, ctx.tex.height * 0.5);
        ctx.tex.scale(1.2);
        ctx.tex.image(img, 0, 0);
        ctx.tex.pop();

        const hand = ctx.imageAnimation.getImage("hand", 2, Easing.zigzag(ctx.beat * 0.3));
        ctx.tex.push();
        ctx.tex.imageMode(ctx.p.CENTER);
        ctx.tex.translate(ctx.tex.width * 0.55, ctx.tex.height * 0.5);
        ctx.tex.scale(1.2);
        ctx.tex.image(hand, 0, 0);
        ctx.tex.pop();
    },

    // scene 6: human 1
    (ctx) => {
        const img = ctx.imageGallery.getImage("human", 1);
        ctx.tex.push();
        ctx.tex.imageMode(ctx.p.CENTER);
        ctx.tex.translate(ctx.tex.width * 0.5, ctx.tex.height * 0.9);
        ctx.tex.scale(2.5);
        ctx.tex.image(img, 0, 0);
        ctx.tex.pop();
    },

    // scene 7: human 2 rotated
    (ctx) => {
        const img = ctx.imageGallery.getImage("human", 2);
        ctx.tex.push();
        ctx.tex.imageMode(ctx.p.CENTER);
        ctx.tex.translate(ctx.tex.width * 0.8, ctx.tex.height * 0.7);
        ctx.tex.rotate(Math.PI * 0.1);
        ctx.tex.scale(0.7);
        ctx.tex.image(img, 0, 0);
        ctx.tex.pop();
    },

    // scene 8: human 3
    (ctx) => {
        const img = ctx.imageGallery.getImage("human", 3);
        ctx.tex.push();
        ctx.tex.imageMode(ctx.p.CENTER);
        ctx.tex.translate(ctx.tex.width * 0.5, ctx.tex.height * 0.7);
        ctx.tex.scale(1.5);
        ctx.tex.image(img, 0, 0);
        ctx.tex.pop();
    },

    // scene 9: walk animation x3
    (ctx) => {
        ctx.tex.push();
        for (let i = 0; i < 3; i++) {
            const walk = ctx.imageAnimation.getImage("walk", Math.floor(UniformRandom.rand(Math.floor(ctx.beat * 2), i * 45782) * 4), Easing.zigzag(ctx.beat * 0.1));
            const x = ctx.tex.width * 0.15 + i * ctx.tex.width * 0.35;
            ctx.tex.push();
            ctx.tex.imageMode(ctx.p.CENTER);
            ctx.tex.translate(x, ctx.tex.height * 0.7);
            ctx.tex.scale(1.3);
            ctx.tex.image(walk, 0, 0);
            ctx.tex.pop();
        }
        ctx.tex.pop();
    },

    // scene 10: human 4
    (ctx) => {
        const img = ctx.imageGallery.getImage("human", 4);
        ctx.tex.push();
        ctx.tex.imageMode(ctx.p.CENTER);
        ctx.tex.translate(ctx.tex.width * 0.5, ctx.tex.height * 0.7);
        ctx.tex.scale(1.2);
        ctx.tex.image(img, 0, 0);
        ctx.tex.pop();
    },
];

/**
 * ImageRendererクラス
 * モード名に応じて画像の描画処理を行う
 */
export class ImageRenderer {
    /**
     * モード名に応じて画像を描画
     */
    draw(
        p: p5,
        tex: p5.Graphics,
        imageAnimation: ImageAnimation,
        imageGallery: ImageGallery,
        beat: number,
        sceneIndex: number,
    ): void {
        tex.push();
        imageScenes[sceneIndex]?.({ p, tex, imageAnimation, imageGallery, beat });
        tex.pop();
    }
}