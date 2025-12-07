// Scene 09: Walk Animation x3
import type { SceneDefinition } from "../SceneManager";
import { Easing } from "../../utils/easing";
import { UniformRandom } from "../../utils/uniformRandom";


export const CarMoving: SceneDefinition = {
    id: "scene09_walk_x3",
    name: "Walk Animation x3",

    drawImage: (ctx) => {
        ctx.tex.push();
        const car = ctx.imageAnimation.getImage("car", 0, Easing.zigzag(ctx.beat * 0.2 + (UniformRandom.rand(Math.floor(ctx.beat * 3.0), 999) < 0.7 ? 0 : UniformRandom.rand(Math.floor(ctx.beat * 3.0), 1000))));
        ctx.tex.imageMode(ctx.p.CENTER);
        ctx.tex.translate(ctx.tex.width / 2, ctx.tex.height / 2);
        ctx.tex.scale(0.5);
        ctx.tex.image(car, 0, 0);
        ctx.tex.pop();
    },

    drawOverlay: (ctx) => {
        ctx.tex.clear();
    }
};