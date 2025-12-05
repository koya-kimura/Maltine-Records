// Scene 01: Noface Cycling
import type { SceneDefinition } from "../SceneManager";
import { GVM } from "../../utils/gvm";
import { UniformRandom } from "../../utils/uniformRandom";
import { map } from "../../utils/mathUtils";

export const scene01: SceneDefinition = {
    id: "scene01_noface_cycling",
    name: "Noface Cycling",

    drawImage: (ctx) => {
        const t = ctx.beat * 0.25 + GVM.leapRamp(ctx.beat, 8, 2) * 8.0;
        const img = ctx.imageGallery.getImage("noface", Math.floor((t) % 4));
        const sclX = map(UniformRandom.rand(1234, Math.floor(ctx.beat * 0.5)), 0, 1, 0.8, 1.1);
        const sclY = map(UniformRandom.rand(5678, Math.floor(ctx.beat * 0.5)), 0, 1, 0.8, 1.0);
        ctx.tex.push();
        ctx.tex.imageMode(ctx.p.CENTER);
        ctx.tex.translate(ctx.tex.width / 2, ctx.tex.height * 0.6);
        ctx.tex.scale(sclX, sclY);
        ctx.tex.image(img, 0, 0);
        ctx.tex.pop();
    },

    drawOverlay: (ctx) => {
        const s = Math.min(ctx.tex.width, ctx.tex.height) * 0.25;
        ctx.tex.clear();
        ctx.tex.noStroke();
        ctx.tex.fill(ctx.colorPalette.accentColor);
        ctx.tex.circle(ctx.tex.width / 2, ctx.tex.height * 0.18, s);

        for (const i of [-1, 1]) {
            ctx.tex.push();
            ctx.tex.translate(i * s * 0.2, 0);
            ctx.tex.fill(255);
            ctx.tex.circle(ctx.tex.width / 2, ctx.tex.height * 0.18, s * 0.3);

            const angle = ctx.beat * 0.5 + GVM.leapRamp(ctx.beat, 8, 2) * Math.PI * 2 * i;
            const gapx = Math.cos(angle) * s * 0.1;
            const gapy = Math.sin(angle) * s * 0.1;
            ctx.tex.fill(10);
            ctx.tex.circle(ctx.tex.width / 2 + gapx, ctx.tex.height * 0.18 + gapy, s * 0.1);
            ctx.tex.pop();
        }
    }
};
