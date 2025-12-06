// Scene 20: Step Animation
import type { SceneDefinition } from "../SceneManager";
import { Easing } from "../../utils/easing";
import { GVM } from "../../utils/gvm";
import { UniformRandom } from "../../utils/uniformRandom";
import { map } from "../../utils/mathUtils";

export const scene23: SceneDefinition = {
    id: "scene22_step",
    name: "Step Animation",

    drawImage: (ctx) => {
        const img0 = ctx.imageAnimation.getImage("step", 0, UniformRandom.rand(Math.floor(ctx.beat * 4.0)));
        const img1 = ctx.imageAnimation.getImage("walk", 0, UniformRandom.rand(Math.floor(ctx.beat * 4.0)));
        const img2 = ctx.imageAnimation.getImage("walk", 1, UniformRandom.rand(Math.floor(ctx.beat * 4.0)));
        const img3 = ctx.imageAnimation.getImage("walk", 2, UniformRandom.rand(Math.floor(ctx.beat * 4.0)));
        const img4 = ctx.imageAnimation.getImage("walk", 3, UniformRandom.rand(Math.floor(ctx.beat * 4.0)));
        const arr = [img0, img1, img2, img3, img4];

        const n = 5;
        for(let i = 0; i < n; i++) {
            const x = (i+0.5) / n * ctx.tex.width;
            const index = Math.floor(UniformRandom.rand(Math.floor(ctx.beat * 2.0), 0) * arr.length);
            const img = arr[index];
            const isFirst = index === 0;
            const isShow = UniformRandom.rand(Math.floor(ctx.beat * 2.0), i) < 0.7;

            if(!isShow) continue;
            ctx.tex.push();
            ctx.tex.translate(x, 0);
            ctx.tex.translate(0, - ctx.tex.height * 0.4);
            ctx.tex.scale(isFirst ? 3.5 : 3.0);
            ctx.tex.imageMode(ctx.p.CENTER);
            ctx.tex.image(img, 0, 0);
            ctx.tex.pop();
        }
    },

    drawOverlay: (ctx) => {
        ctx.tex.clear();

        const n = 5;
        for (let i = 0; i < n; i++) {
            const x = (i + 0.5) / n * ctx.tex.width;
            const y = ctx.tex.height * 0.9;
            const s = Math.min(ctx.tex.width, ctx.tex.height) * 0.1;
            const isShow = UniformRandom.rand(Math.floor(ctx.beat * 2.0), i) < 0.7;

            ctx.tex.push();
            ctx.tex.translate(x, y);
            ctx.tex.rectMode(ctx.p.CENTER);

            if (isShow) {
                ctx.tex.noStroke();
                ctx.tex.fill(ctx.colorPalette.accentColor);
                ctx.tex.rect(0, 0, s, s);
            }
            
            ctx.tex.pop();
        }
    }
};
