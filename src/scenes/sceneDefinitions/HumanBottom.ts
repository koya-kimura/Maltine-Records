// Scene 06: Human 1
import type { SceneDefinition } from "../SceneManager";
import { Easing } from "../../utils/easing";
import { map } from "../../utils/mathUtils";

export const HumanBottom: SceneDefinition = {
    id: "scene06_human_1",
    name: "Human 1",

    drawImage: (ctx) => {
        const img = ctx.imageGallery.getImage("human", 1);
        ctx.tex.push();
        ctx.tex.imageMode(ctx.p.CENTER);
        ctx.tex.translate(ctx.tex.width * 0.5, ctx.tex.height * 0.9);
        ctx.tex.scale(2.5);
        ctx.tex.image(img, 0, 0);
        ctx.tex.pop();
    },

    drawOverlay: (ctx) => {
        ctx.tex.clear();
        const s = Math.min(ctx.tex.width, ctx.tex.height) * 0.15;
        const y = map(Easing.easeInOutCubic((ctx.beat * 0.5) % 1), 0, 1, ctx.tex.height * 0.4, ctx.tex.height * 1.3);
        ctx.tex.noStroke();
        ctx.tex.fill(ctx.colorPalette.accentColor);
        ctx.tex.circle(ctx.tex.width * 0.41, y, s);
    }
};
