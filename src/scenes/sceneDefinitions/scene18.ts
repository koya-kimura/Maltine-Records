// Scene 18: Life 3
import type { SceneDefinition } from "../SceneManager";
import { GVM } from "../../utils/gvm";
import { Easing } from "../../utils/easing";
import { UniformRandom } from "../../utils/uniformRandom";
import { map } from "../../utils/mathUtils";

export const scene18: SceneDefinition = {
    id: "scene18_life_3",
    name: "Life 3",

    drawImage: (ctx) => {
        const img = ctx.imageGallery.getImage("life", 3);
        const sclX = map(Easing.easeOutQuad(Easing.zigzag(ctx.beat)), 0, 1, 1, 0.6);
        const sclY = map(Easing.easeOutSine(Easing.zigzag(ctx.beat)), 0, 1, 0.8, 1);
        const n = 5;

        for (let i = 0; i < n; i++) {
            const angle = GVM.leapNoise(ctx.beat + i / n, 8, 2, Easing.easeOutExpo) * Math.PI * 2;

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

    drawOverlay: (ctx) => {
        ctx.tex.clear();

        const n = 8;
        const angle = GVM.leapNoise(ctx.beat + 0.5, 8, 2, Easing.easeOutExpo) * Math.PI * 2;

        ctx.tex.push();
        ctx.tex.translate(ctx.tex.width * 0.5, ctx.tex.height * 0.5);
        ctx.tex.rotate(angle);
        for (let i = 0; i < n; i++) {
            const x = map(i, 0, n - 1, -ctx.tex.width * 0.2, ctx.tex.width * 0.2);
            const isShow = UniformRandom.rand(i * 1234, Math.floor(ctx.beat * 2) * 5678) < 0.5;
            
            if (isShow) {
                ctx.tex.push();
                ctx.tex.fill(ctx.colorPalette.accentColor);
                ctx.tex.rectMode(ctx.p.CENTER);
                ctx.tex.noStroke();
                ctx.tex.rect(x, 0, ctx.tex.width * 0.03, ctx.tex.height * 0.15);
                ctx.tex.pop();
            }
        }
        ctx.tex.pop();
    }
};
