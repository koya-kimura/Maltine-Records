// Scene 09: Walk Animation x3
import type { SceneDefinition } from "../SceneManager";
import { Easing } from "../../utils/easing";
import { UniformRandom } from "../../utils/uniformRandom";

export const scene09: SceneDefinition = {
    id: "scene09_walk_x3",
    name: "Walk Animation x3",

    drawImage: (ctx) => {
        ctx.tex.push();
        for (let i = 0; i < 3; i++) {
            const walk = ctx.imageAnimation.getImage("walk", Math.floor(UniformRandom.rand(Math.floor(ctx.beat * 2), i * 45782) * 4), Easing.zigzag(ctx.beat * 0.1));
            const x = ctx.tex.width * 0.15 + i * ctx.tex.width * 0.35;
            ctx.tex.push();
            ctx.tex.imageMode(ctx.p.CENTER);
            ctx.tex.translate(x, ctx.tex.height * 0.7);
            ctx.tex.scale(1.3);
            ctx.tex.image(walk, 0, 0);
            ctx.tex.pop();
        }
        ctx.tex.pop();
    },

    drawOverlay: (ctx) => {
        ctx.tex.clear();
        // TODO: overlay
    }
};
