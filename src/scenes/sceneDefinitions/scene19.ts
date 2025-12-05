// Scene 19: Dance Big
import type { SceneDefinition } from "../SceneManager";
import { Easing } from "../../utils/easing";

export const scene19: SceneDefinition = {
    id: "scene19_dance_big",
    name: "Dance Big",

    drawImage: (ctx) => {
        const img = ctx.imageAnimation.getImage("dance", 0, Easing.zigzag(ctx.beat * 0.2));
        ctx.tex.push();
        ctx.tex.imageMode(ctx.p.CENTER);
        ctx.tex.translate(ctx.tex.width * 0.7, ctx.tex.height * 0.85);
        ctx.tex.scale(3.0);
        ctx.tex.image(img, 0, 0);
        ctx.tex.pop();
    },

    drawOverlay: (ctx) => {
        ctx.tex.clear();
        // empty overlay
    }
};
