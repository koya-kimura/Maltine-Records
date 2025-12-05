// Scene 07: Human 2 Rotated
import type { SceneDefinition } from "../SceneManager";
import { Easing } from "../../utils/easing";
import { UniformRandom } from "../../utils/uniformRandom";
import { map, fract } from "../../utils/mathUtils";

export const scene07: SceneDefinition = {
    id: "scene07_human_2_rotated",
    name: "Human 2 Rotated",

    drawImage: (ctx) => {
        const img = ctx.imageGallery.getImage("human", 2);
        ctx.tex.push();
        ctx.tex.imageMode(ctx.p.CENTER);
        ctx.tex.translate(ctx.tex.width * 0.8, ctx.tex.height * 0.7);
        ctx.tex.rotate(Math.PI * 0.1);
        ctx.tex.scale(0.7);
        ctx.tex.image(img, 0, 0);
        ctx.tex.pop();
    },

    drawOverlay: (ctx) => {
        ctx.tex.clear();
        for (let i = 0; i < 20; i++) {
            const t = fract(ctx.beat * 0.3 + i * 0.1);
            const x = map(t, 0, 1, ctx.tex.width * 0.6, -ctx.tex.width * 0.1);
            const y = map(Easing.easeInSine(Math.abs(t - 0.5) * 2), 1, 0, ctx.tex.height * 0.5, ctx.tex.height * map(UniformRandom.rand(i * 5281), 0, 1, 0.2, 0.45));
            const s = map(Easing.easeOutQuad(t), 0, 1, 0.02, 0.2) * Math.min(ctx.tex.width, ctx.tex.height) * map(Easing.easeOutQuint(Easing.zigzag(ctx.beat)), 0, 1, 0.5, 1.0);
            const c = ctx.colorPalette.accentColor;

            ctx.tex.fill(c);
            ctx.tex.noStroke();
            ctx.tex.circle(x, y, s);
        }
    }
};
