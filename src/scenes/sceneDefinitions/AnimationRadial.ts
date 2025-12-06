// Scene 20: Step Animation
import type { SceneDefinition } from "../SceneManager";
import { Easing } from "../../utils/easing";
import { GVM } from "../../utils/gvm";
import { map } from "../../utils/mathUtils";
import { UniformRandom } from "../../utils/uniformRandom";

export const AnimationRadial: SceneDefinition = {
    id: "scene21_step",
    name: "Step Animation",

    drawImage: (ctx) => {

        const n = 8;
        for (let i = 0; i < n; i++) {
            const t =  ctx.beat * 0.25 + GVM.leapRamp(ctx.beat + i, 64, n * 2) + (UniformRandom.rand(Math.floor(ctx.beat), i) < 0.95 ? 0 : (UniformRandom.rand(Math.floor(ctx.beat * 4.0), i)));
            const angle = (ctx.p.TWO_PI / n) * i + ctx.beat * 0.3;
            const hand = ctx.imageAnimation.getImage("hand", 0, Easing.zigzag(t));
            ctx.tex.push();
            ctx.tex.imageMode(ctx.p.CENTER);
            ctx.tex.translate(ctx.tex.width * 0.5, ctx.tex.height * 0.5);
            ctx.tex.rotate(angle);
            ctx.tex.scale(1.5);
            ctx.tex.image(hand, 0, 0);
            ctx.tex.pop();
        }
    },

    drawOverlay: (ctx) => {
        ctx.tex.clear();
        
        const n = 200;
        
        ctx.tex.push();
        ctx.tex.translate(ctx.tex.width * 0.5, ctx.tex.height * 0.5);
        ctx.tex.noFill();
        ctx.tex.strokeWeight(10);
        ctx.tex.stroke(ctx.colorPalette.accentColor);
        ctx.tex.beginShape();
        for (let i = 0; i < n; i++) {
            const radius = map(Math.sin(Math.PI * 2 * 8 * i / n + ctx.beat * 0.5), -1, 1, 0.8, 1.0) * Math.min(ctx.tex.width, ctx.tex.height) * 0.48;
            const angle = (ctx.p.TWO_PI / n) * i;
            const x = Math.cos(angle) * radius
            const y = Math.sin(angle) * radius
            
            ctx.tex.vertex(x, y);
        }
        ctx.tex.endShape(ctx.p.CLOSE);
        ctx.tex.pop();
    }
};
