// Scene 10: Human 4
import type { SceneDefinition } from "../SceneManager";
import { Easing } from "../../utils/easing";
import { UniformRandom } from "../../utils/uniformRandom";
import { map, fract } from "../../utils/mathUtils";

export const scene10: SceneDefinition = {
    id: "scene10_human_4",
    name: "Human 4",

    drawImage: (ctx) => {
        const img = ctx.imageGallery.getImage("human", 4);
        ctx.tex.push();
        ctx.tex.imageMode(ctx.p.CENTER);
        ctx.tex.translate(ctx.tex.width * 0.5, ctx.tex.height * 0.7);
        ctx.tex.scale(1.2);
        ctx.tex.image(img, 0, 0);
        ctx.tex.pop();
    },

    drawOverlay: (ctx) => {
        ctx.tex.clear();
        for (let i = 0; i < 20; i++) {
            const t = fract(ctx.beat * 0.4 + i * 0.15);
            const x = map(t, 0, 1, ctx.tex.width * 0.6, ctx.tex.width * map(UniformRandom.rand(i * 7821), 0, 1, 0.4, 0.8)) + Math.sin(ctx.beat + i) * ctx.tex.width * 0.01;
            const y = map(t, 0, 1, ctx.tex.height * 0.5, -ctx.tex.height * 0.1);
            const s = map(Easing.easeOutQuad(t), 0, 1, 0.02, 0.25) * Math.min(ctx.tex.width, ctx.tex.height) * map(Easing.easeOutQuint(Easing.zigzag(ctx.beat)), 0, 1, 0.5, 1.0);
            const c = ctx.colorPalette.accentColor;

            ctx.tex.fill(ctx.p.red(c), ctx.p.green(c), ctx.p.blue(c), 150);
            ctx.tex.noStroke();
            ctx.tex.circle(x, y, s);
        }
    }
};
