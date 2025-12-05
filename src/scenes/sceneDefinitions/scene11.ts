// Scene 11: Dance Random
import type { SceneDefinition } from "../SceneManager";
import { Easing } from "../../utils/easing";
import { UniformRandom } from "../../utils/uniformRandom";

export const scene11: SceneDefinition = {
    id: "scene11_dance_random",
    name: "Dance Random",

    drawImage: (ctx) => {
        for (let i = 0; i < 10; i++) {
            const dance = ctx.imageAnimation.getImage("dance", Math.floor(UniformRandom.rand(Math.floor(ctx.beat * 2), i * 45782) * 4), Easing.zigzag(ctx.beat * 0.15));
            const x = UniformRandom.rand(i * 54729, Math.floor(ctx.beat / 4)) * ctx.tex.width;
            const y = UniformRandom.rand(i * 84291, Math.floor(ctx.beat / 4)) * ctx.tex.height;
            const scl = Math.pow(UniformRandom.rand(i, 2), 2) * 2.0 + 0.5;
            ctx.tex.push();
            ctx.tex.imageMode(ctx.p.CENTER);
            ctx.tex.translate(x, y);
            ctx.tex.scale(scl);
            ctx.tex.image(dance, 0, 0);
            ctx.tex.pop();
        }
    },

    drawOverlay: (ctx) => {
        ctx.tex.clear();
        // empty overlay
    }
};
