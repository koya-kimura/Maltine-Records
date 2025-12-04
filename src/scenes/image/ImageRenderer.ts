// ImageRenderer は画像の描画処理を管理するクラス。
// モード名を受け取り、サイズ変更、複数表示、動きなどの描画処理を行う。
import p5 from "p5";
import { ImageAnimation } from "./ImageAnimation";
import { ImageGallery } from "./ImageGallery";
import { Easing } from "../../utils/easing";
import { UniformRandom } from "../../utils/uniformRandom";
import { fract, map } from "../../utils/mathUtils";
import { GVM } from "../../utils/gvm";

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

    // scene 11: human 4
    (ctx) => {
        for (let i = 0; i < 10; i++) {
            const dance = ctx.imageAnimation.getImage("dance", Math.floor(UniformRandom.rand(Math.floor(ctx.beat * 2), i * 45782) * 4), Easing.zigzag(ctx.beat * 0.15));
            const x = UniformRandom.rand(i * 54729, Math.floor(ctx.beat / 4)) * ctx.tex.width;
            const y = UniformRandom.rand(i * 84291, Math.floor(ctx.beat / 4)) * ctx.tex.height;
            const scl = Math.pow(UniformRandom.rand(i, 2), 2) * 2.0 + 0.5;
            ctx.tex.push();
            ctx.tex.imageMode(ctx.p.CENTER);
            ctx.tex.translate(x, y);
            ctx.tex.scale(scl);
            ctx.tex.image(dance, 0, 0);
            ctx.tex.pop();
        }
    },

    // scene 12: noface
    (ctx) => {
        const img = ctx.imageGallery.getImage("noface", Math.floor(UniformRandom.rand(Math.floor(ctx.beat * 0.5), 0) * 4));
        ctx.tex.push();
        ctx.tex.imageMode(ctx.p.CENTER);
        ctx.tex.translate(ctx.tex.width * 0.5, ctx.tex.height * 1.6);
        ctx.tex.scale(2.5);
        ctx.tex.image(img, 0, 0);
        ctx.tex.pop();
    },

    // scene 13: noface
    (ctx) => {

        const img = ctx.imageAnimation.getImage("dothand", Math.floor(UniformRandom.rand(Math.floor(ctx.beat * 0.25), 0) * 3), fract(ctx.beat * 0.25));
        ctx.tex.push();
        ctx.tex.imageMode(ctx.p.CENTER);
        ctx.tex.translate(ctx.tex.width * 0.5, ctx.tex.height * 0.5);
        ctx.tex.scale(0.8);
        ctx.tex.image(img, 0, 0);
        ctx.tex.pop();
    },

    // scene 14: life
    (ctx) => {
        const img = ctx.imageGallery.getImage("life", 0);
        ctx.tex.push();
        ctx.tex.imageMode(ctx.p.CENTER);
        ctx.tex.translate(ctx.tex.width * 0.5, ctx.tex.height * 0.5);
        ctx.tex.scale(0.8);
        ctx.tex.scale(map(Easing.easeOutQuad(Easing.zigzag(ctx.beat)), 0, 1, 1, 0.9), map(Easing.easeOutSine(Easing.zigzag(ctx.beat)), 0, 1, 1, 0.95))
        ctx.tex.rotate(Easing.zigzag(ctx.beat) * Math.PI * 0.1);
        ctx.tex.rotate(Easing.zigzag(ctx.beat * 8.0) * Math.PI * 0.01);
        ctx.tex.image(img, 0, 0);
        ctx.tex.pop();
    },

    // scene 15: life
    (ctx) => {
        const img = ctx.imageGallery.getImage("life", 1);
        for(let i = 0; i < 10; i++){
            const sp = map(UniformRandom.rand(i * 1234), 0, 1, 0.1, 0.2);
            const seed = Math.floor(UniformRandom.rand(i * 5678) * 10.0 + ctx.beat*sp)
            const x = UniformRandom.rand(i * 1234, seed) * ctx.tex.width;
            const y = map((UniformRandom.rand(i * 5678) * 10.0 + ctx.beat*sp) % 1, 0, 1, -0.5, 1.5) * ctx.tex.height;
            const angle = UniformRandom.rand(i * 91011) * Math.PI * 2 + ctx.beat * map(UniformRandom.rand(i * 1213), 0, 1, 0.2, 0.5);
            const scl = map(Math.pow(UniformRandom.rand(i * 1213, seed), 2), 0, 1, 0.3, 0.7);

            ctx.tex.push();
            ctx.tex.imageMode(ctx.p.CENTER);
            ctx.tex.translate(x, y);
            ctx.tex.rotate(angle);
            ctx.tex.scale(scl);
            ctx.tex.image(img, 0, 0);
            ctx.tex.pop();
        }
    },

    // scene 16: 人の回転
    (ctx) => {
        const n = 3;
        for(let j = 0; j < n; j++){
            const m = map(j, 0, n-1, 12, 5);
            for(let i = 0; i < m; i++){
                const radius = Math.min(ctx.tex.width, ctx.tex.height) * map(j, 0, n-1, 0.8, 0.25);
                const angle = (i / m) * Math.PI * 2 + ctx.beat * 0.125 + j * 0.2 + GVM.leapRamp(ctx.beat, 8, 2) * 0.25 * Math.PI + j * 0.1;
                const x = Math.cos(angle) * radius + ctx.tex.width / 2;
                const y = Math.sin(angle) * radius + ctx.tex.height / 2;
                const imgIndex = (j + i) % 4;
                const img = ctx.imageAnimation.getImage("walk", imgIndex, fract(ctx.beat * 0.1 + i * 0.1 + j * 0.2 + GVM.leapRamp(ctx.beat, 8, 2) * 0.25));

                ctx.tex.push();
                ctx.tex.imageMode(ctx.p.CENTER);
                ctx.tex.translate(x, y);
                ctx.tex.rotate(angle + Math.PI / 2);
                ctx.tex.scale(0.45);
                ctx.tex.image(img, 0, 0);
                ctx.tex.pop();
            }
        }
    },

    // scene 17: life
    (ctx) => {
        const img = ctx.imageGallery.getImage("life", 2);
        const sclX = map(Easing.easeOutQuad(Easing.zigzag(ctx.beat)), 0, 1, 1, 0.9);
        const sclY = map(Easing.easeOutSine(Easing.zigzag(ctx.beat)), 0, 1, 0.95, 1);

        ctx.tex.push();
        ctx.tex.imageMode(ctx.p.CENTER);
        ctx.tex.translate(ctx.tex.width * 0.5, ctx.tex.height * 0.75);
        ctx.tex.scale(1.3);
        ctx.tex.scale(sclX, sclY);
        ctx.tex.image(img, 0, 0);
        ctx.tex.pop();
    },

    // scene 18: life
    (ctx) => {
        const img = ctx.imageGallery.getImage("life", 3);
        const sclX = map(Easing.easeOutQuad(Easing.zigzag(ctx.beat)), 0, 1, 1, 0.6);
        const sclY = map(Easing.easeOutSine(Easing.zigzag(ctx.beat)), 0, 1, 0.8, 1);
        const n = 5;

        for(let i = 0; i < n; i++){
            const angle = GVM.leapNoise(ctx.beat + i/n, 8, 2, Easing.easeOutExpo) * Math.PI * 2;

            ctx.tex.push();
            ctx.tex.imageMode(ctx.p.CENTER);
            ctx.tex.translate(ctx.tex.width * 0.5, ctx.tex.height * 0.5);
            ctx.tex.rotate(angle);
            ctx.tex.scale(1.3);
            ctx.tex.scale(sclX, sclY);
            ctx.tex.image(img, 0, 0);
            ctx.tex.pop();
        }
    },

    // scene 19:
    (ctx) => {
        const img = ctx.imageAnimation.getImage("dance", 0, Easing.zigzag(ctx.beat * 0.2));
        ctx.tex.push();
        ctx.tex.imageMode(ctx.p.CENTER);
        ctx.tex.translate(ctx.tex.width * 0.7, ctx.tex.height * 0.85);
        ctx.tex.scale(3.0);
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