// Scene 13: Dothand Animation
import type { SceneDefinition } from "../SceneManager";
import { UniformRandom } from "../../utils/uniformRandom";
import { fract } from "../../utils/mathUtils";

export const scene13: SceneDefinition = {
    id: "scene13_dothand",
    name: "Dothand Animation",

    drawImage: (ctx) => {
        const img = ctx.imageAnimation.getImage("dothand", Math.floor(UniformRandom.rand(Math.floor(ctx.beat * 0.25), 0) * 3), fract(ctx.beat * 0.25));
        ctx.tex.push();
        ctx.tex.imageMode(ctx.p.CENTER);
        ctx.tex.translate(ctx.tex.width * 0.5, ctx.tex.height * 0.5);
        ctx.tex.scale(0.8);
        ctx.tex.image(img, 0, 0);
        ctx.tex.pop();
    },

    drawOverlay: (ctx) => {
        ctx.tex.clear();
        // empty overlay
    }
};
