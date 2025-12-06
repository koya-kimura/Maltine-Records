// Scene 14: Life 0
import type { SceneDefinition } from "../SceneManager";
import { Easing } from "../../utils/easing";
import { map } from "../../utils/mathUtils";

export const LifeOrbit: SceneDefinition = {
    id: "scene14_life_0",
    name: "Life 0",

    drawImage: (ctx) => {
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

    drawOverlay: (ctx) => {
        ctx.tex.clear();
        ctx.tex.push();
        const n = 20;
        for (let i = 0; i < n; i++) {
            const angle = (i / n) * Math.PI * 2 + ctx.beat * 0.5;
            const radius = Math.min(ctx.tex.width, ctx.tex.height) * 0.43;
            const x = Math.cos(angle) * radius * 1.15 + ctx.tex.width * 0.4;
            const y = Math.sin(angle) * radius + ctx.tex.height / 2;
            const s = Math.min(ctx.tex.width, ctx.tex.height) * 0.06 * map(Easing.zigzag(ctx.beat * 0.5 + i % 2), 0, 1, 0.5, 1.5);

            ctx.tex.noStroke();
            ctx.tex.fill(ctx.colorPalette.accentColor);
            ctx.tex.circle(x, y, s);
        }
        ctx.tex.pop();
    }
};
