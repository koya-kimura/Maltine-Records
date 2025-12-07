// Scene 05: Human 0 with Hand Animation
import type { SceneDefinition } from "../SceneManager";

import { map, fract } from "../../utils/mathUtils";
import { UniformRandom } from "../../utils/uniformRandom";

export const GoodHand: SceneDefinition = {
    id: "scene05_human_0_hand",
    name: "Human 0 with Hand",

    drawImage: (ctx) => {
        const flower = ctx.imageGallery.getImage("life", 4);
        ctx.tex.push();
        ctx.tex.imageMode(ctx.p.CENTER);
        ctx.tex.translate(ctx.tex.width * 0.5, ctx.tex.height * 0.25);
        ctx.tex.scale(0.4);
        ctx.tex.rotate(ctx.beat * 0.5);
        ctx.tex.image(flower, 0, 0);
        ctx.tex.pop();

        const n = 10;
        for (let i = 0; i < n; i++) {
            const x = map(i, 0, n - 1, ctx.tex.width * 1.1, -ctx.tex.width * 0.1);
            const hand = ctx.imageAnimation.getImage("hand", 3, UniformRandom.rand(Math.floor(ctx.beat * 4.0), i * 37) );
            ctx.tex.push();
            ctx.tex.imageMode(ctx.p.CENTER);
            ctx.tex.translate(x, ctx.tex.height * 0.65);
            ctx.tex.scale(0.9);
            ctx.tex.rotate(Math.PI * 0.38)
            ctx.tex.image(hand, 0, 0);
            ctx.tex.pop();
        }
    },

    drawOverlay: (ctx) => {
        ctx.tex.clear();

        for(let i = 0; i < 20; i++){
            const x = map(fract(ctx.beat * 0.3 + i * 0.1), 0, 1, 0, ctx.tex.width);
            const y = map(UniformRandom.rand(Math.floor(ctx.beat * 0.5), i * 59), 0, 1, 0, ctx.tex.height);
            const s = map(Math.sin(ctx.beat * 3.0 + i), -1, 1, 10, 30);

            ctx.tex.stroke(ctx.colorPalette.accentColor);
            ctx.tex.noFill();
            ctx.tex.circle(x, y, s);
        }
    }
};
