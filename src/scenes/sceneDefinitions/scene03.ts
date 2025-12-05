// Scene 03: Animal 1
import type { SceneDefinition } from "../SceneManager";
import { GVM } from "../../utils/gvm";
import { Easing } from "../../utils/easing";
import { map } from "../../utils/mathUtils";

export const scene03: SceneDefinition = {
    id: "scene03_animal_1",
    name: "Animal 1",

    drawImage: (ctx) => {
        const img = ctx.imageGallery.getImage("animal", 1);
        const angle = map(Easing.zigzag(GVM.leapRamp(ctx.beat, 4, 3) * 16.0), 0, 1, -Math.PI * 0.02, Math.PI * 0.02);

        ctx.tex.push();
        ctx.tex.imageMode(ctx.p.CENTER);
        ctx.tex.translate(ctx.tex.width * 0.3, ctx.tex.height * 0.55);
        ctx.tex.rotate(angle);
        ctx.tex.scale(1.5);
        ctx.tex.image(img, 0, 0);
        ctx.tex.pop();
    },

    drawOverlay: (ctx) => {
        ctx.tex.clear();
        const c = ctx.colorPalette.accentColor;
        const s = Math.min(ctx.tex.width, ctx.tex.height) * 0.25;
        const gapY = map(Easing.zigzag(GVM.leapRamp(ctx.beat, 8, 2)), 0, 1, 0, ctx.tex.height * 0.2);
        const gapX = map(Easing.zigzag(GVM.leapRamp(ctx.beat, 8, 2)), 0, 1, 0, ctx.tex.width * 0.02);

        ctx.tex.push();
        ctx.tex.translate(gapX, gapY);
        ctx.tex.noStroke();
        ctx.tex.fill(c);
        ctx.tex.circle(ctx.tex.width * 0.35, ctx.tex.height * 0.5, s);
        ctx.tex.circle(ctx.tex.width * 0.48, ctx.tex.height * 0.45, s);

        ctx.tex.fill(ctx.colorPalette.mainColor);
        ctx.tex.circle(ctx.tex.width * 0.35, ctx.tex.height * 0.5, s * map(Easing.zigzag(ctx.beat), 0, 1, 0.7, 0.9));
        ctx.tex.circle(ctx.tex.width * 0.48, ctx.tex.height * 0.45, s * map(Easing.zigzag(ctx.beat), 0, 1, 0.7, 0.9));

        ctx.tex.pop();
    }
};
