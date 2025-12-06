// Scene 20: Step Animation
import type { SceneDefinition } from "../SceneManager";
import { Easing } from "../../utils/easing";
import { GVM } from "../../utils/gvm";
import { UniformRandom } from "../../utils/uniformRandom";
import { map, fract } from "../../utils/mathUtils";

export const scene24: SceneDefinition = {
    id: "scene22_step",
    name: "Step Animation",

    drawImage: (ctx) => {
        const walk = ctx.imageAnimation.getImage("walk", 0, Easing.zigzag(ctx.beat * 0.125));

        ctx.tex.push();
        ctx.tex.imageMode(ctx.p.CENTER);
        ctx.tex.translate(ctx.tex.width * 0.5, ctx.tex.height * 0.5);
        ctx.tex.scale(1.2);
        ctx.tex.image(walk, 0, 0);
        ctx.tex.pop();
    },

    drawOverlay: (ctx) => {
        ctx.tex.clear();
        const s = Math.min(ctx.tex.width, ctx.tex.height) * 0.27;
        ctx.tex.clear();
        ctx.tex.push();
        ctx.tex.noStroke();
        ctx.tex.fill(ctx.colorPalette.accentColor);
        ctx.tex.circle(ctx.tex.width * 0.51, ctx.tex.height * 0.15, s);

        ctx.tex.push();
        ctx.tex.translate(s * 0.25, 0);
        ctx.tex.fill(255);
        ctx.tex.circle(ctx.tex.width * 0.51, ctx.tex.height * 0.15, s * 0.3);

        const gapx = s * 0.1;
        ctx.tex.fill(10);
        ctx.tex.circle(ctx.tex.width * 0.51 + gapx, ctx.tex.height * 0.15, s * 0.1);
        ctx.tex.pop();
        ctx.tex.pop();

        ctx.tex.push();
        ctx.tex.translate(ctx.tex.width * 0.5, ctx.tex.height * 0.5);
        ctx.tex.rotate(Math.PI * 7 / 8);
        const n = 50;
        for(let i = 0; i < n; i ++){
            const x1 = map(fract(GVM.leapRamp(ctx.beat * 0.75 + (i%16), 16, 1)), 0, 1, -1.0, 1.0) * ctx.tex.width;
            const x2 = map(fract(GVM.leapRamp(ctx.beat * 0.75 + (i%16) + 0.5, 16, 1)), 0, 1, -1.0, 1.0) * ctx.tex.width;
            const y = map(UniformRandom.rand(i * 9182 + 3), 0, 1, -0.5, 0.5) * ctx.tex.height;

            ctx.tex.stroke(ctx.colorPalette.accentColor);
            ctx.tex.strokeWeight(5);
            ctx.tex.line(x1, y, x2, y);
        }
        ctx.tex.pop();
    }
};
