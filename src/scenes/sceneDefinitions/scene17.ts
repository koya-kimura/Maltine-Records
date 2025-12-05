// Scene 17: Life 2
import type { SceneDefinition } from "../SceneManager";
import { Easing } from "../../utils/easing";
import { UniformRandom } from "../../utils/uniformRandom";
import { map, fract } from "../../utils/mathUtils";

export const scene17: SceneDefinition = {
    id: "scene17_life_2",
    name: "Life 2",

    drawImage: (ctx) => {
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

    drawOverlay: (ctx) => {
        ctx.tex.clear();
        ctx.tex.push();
        const n = 30;
        for (let i = 0; i < n; i++) {
            const t = fract(ctx.beat * 0.3 + i * 0.1);
            const sx = UniformRandom.rand(i * 9182) * ctx.tex.width;
            const ex = ctx.tex.width * 0.5;
            const x = map(t, 0, 1, sx, ex);

            const sy = map(UniformRandom.rand(i * 9182 + 1), 0, 1, ctx.tex.height * 0.45, ctx.tex.height * 0.5);
            const ey = map(UniformRandom.rand(i * 9182 + 2), 0, 1, ctx.tex.height * 0.05, ctx.tex.height * 0.2);
            const y = map(Math.sin(t * Math.PI), 0, 1, sy, ey);

            const s = (map(Math.abs(t - 0.5), 0.5, 0, 0.1, 0.15) * map(Easing.zigzag(ctx.beat + i % 2), 0, 1, 0.5, 1.0)) * Math.min(ctx.tex.width, ctx.tex.height);
            const a = map(Math.abs(t - 0.5), 0.5, 0, 0, 255);
            const c = ctx.colorPalette.accentColor;

            ctx.tex.fill(ctx.p.red(c), ctx.p.green(c), ctx.p.blue(c), a);
            ctx.tex.noStroke();
            ctx.tex.circle(x, y, s);
        }
        ctx.tex.pop();
    }
};
