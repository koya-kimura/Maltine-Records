// Scene 05: Human 0 with Hand Animation
import type { SceneDefinition } from "../SceneManager";
import { Easing } from "../../utils/easing";
import { map } from "../../utils/mathUtils";

export const HumanWithHand: SceneDefinition = {
    id: "scene05_human_0_hand",
    name: "Human 0 with Hand",

    drawImage: (ctx) => {
        const img = ctx.imageGallery.getImage("human", 0);
        ctx.tex.push();
        ctx.tex.imageMode(ctx.p.CENTER);
        ctx.tex.translate(ctx.tex.width * 0.5, ctx.tex.height * 0.5);
        ctx.tex.scale(1.2);
        ctx.tex.image(img, 0, 0);
        ctx.tex.pop();

        const hand = ctx.imageAnimation.getImage("hand", 2, Easing.zigzag(ctx.beat * 0.3));
        ctx.tex.push();
        ctx.tex.imageMode(ctx.p.CENTER);
        ctx.tex.translate(ctx.tex.width * 0.55, ctx.tex.height * 0.5);
        ctx.tex.scale(1.2);
        ctx.tex.image(hand, 0, 0);
        ctx.tex.pop();
    },

    drawOverlay: (ctx) => {
        ctx.tex.clear();
        const c = ctx.colorPalette.accentColor;
        const s = Math.min(ctx.tex.width, ctx.tex.height) * 0.07;
        const alpha = map(Math.sin(ctx.beat * 0.2), -1, 1, 50, 200);
        ctx.tex.noStroke();
        ctx.tex.fill(ctx.p.red(c), ctx.p.green(c), ctx.p.blue(c), alpha);
        ctx.tex.circle(ctx.tex.width * 0.43, ctx.tex.height * 0.3, s);
    }
};
