// Scene 08: Human 3
import type { SceneDefinition } from "../SceneManager";
import { map } from "../../utils/mathUtils";

export const HumanZigzag: SceneDefinition = {
    id: "scene08_human_3",
    name: "Human 3",

    drawImage: (ctx) => {
        const img = ctx.imageGallery.getImage("human", 3);
        ctx.tex.push();
        ctx.tex.imageMode(ctx.p.CENTER);
        ctx.tex.translate(ctx.tex.width * 0.5, ctx.tex.height * 0.7);
        ctx.tex.scale(1.5);
        ctx.tex.image(img, 0, 0);
        ctx.tex.pop();
    },

    drawOverlay: (ctx) => {
        ctx.tex.clear();
        ctx.tex.fill(ctx.colorPalette.accentColor);
        ctx.tex.noStroke();
        ctx.tex.beginShape();
        const n = 10;
        for (let i = 0; i < n * 2; i++) {
            const k = i - n < 0 ? -1 : 1;
            const j = Math.abs(i - n);
            const x = map(j, 0, n, 0.03, 0.25) * ctx.tex.width;
            const y = (0.35 + (j % 2 == 0 ? 0.02 : -0.02) + k * map(Math.abs(j - n / 2), n / 2, 0, 0, 0.03)) * ctx.tex.height;
            ctx.tex.vertex(x, y);
        }
        ctx.tex.endShape(ctx.p.CLOSE);
    }
};
