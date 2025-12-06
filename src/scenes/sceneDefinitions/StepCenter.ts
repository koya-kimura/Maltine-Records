// Scene 20: Step Animation
import type { SceneDefinition } from "../SceneManager";
import { Easing } from "../../utils/easing";

export const StepCenter: SceneDefinition = {
    id: "scene20_step",
    name: "Step Animation",

    drawImage: (ctx) => {
        const img = ctx.imageAnimation.getImage("step", 0, Easing.zigzag(ctx.beat * 0.2));
        ctx.tex.push();
        ctx.tex.imageMode(ctx.p.CENTER);
        ctx.tex.translate(ctx.tex.width * 0.5, ctx.tex.height * 0.5);
        ctx.tex.scale(2.0);
        ctx.tex.image(img, 0, 0);
        ctx.tex.pop();
    },

    drawOverlay: (ctx) => {
        ctx.tex.clear();
        // empty overlay
    }
};
