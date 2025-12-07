// Scene 08: Human 3
import type { SceneDefinition } from "../SceneManager";
import { map } from "../../utils/mathUtils";
import { Easing } from "../../utils/easing";
import { UniformRandom } from "../../utils/uniformRandom";
import { fract } from "../../utils/mathUtils";

export const HumanZigzag: SceneDefinition = {
    id: "scene08_human_3",
    name: "Human 3",

    drawImage: (ctx) => {
        const cd = ctx.imageGallery.getImage("life", 6);
        for(let i = 0; i < 40; i ++){
            const x = map(i, 0, 39, 0, ctx.tex.width);
            const y = map(fract(UniformRandom.rand(i, 0) + ctx.beat * map(Math.pow(UniformRandom.rand(i, 2), 2), 0, 1, 0.15, 0.25)), 0, 1, -ctx.tex.height * 0.2, ctx.tex.height * 1.2);
            const scl = 0.5;
            const asp = map(Easing.zigzag(ctx.beat * 0.1 + UniformRandom.rand(i, 1)), 0, 1, 0.8, 1.2);
            const angle = UniformRandom.rand(i, 0) * Math.PI * 2;

            ctx.tex.push();
            ctx.tex.translate(x, y);
            ctx.tex.rotate(angle);
            ctx.tex.scale(scl*asp, scl);
            ctx.tex.imageMode(ctx.p.CENTER);
            ctx.tex.image(cd, 0, 0);
            ctx.tex.pop();
        }

        const img = ctx.imageGallery.getImage("human", 3);
        ctx.tex.push();
        ctx.tex.imageMode(ctx.p.CENTER);
        ctx.tex.translate(ctx.tex.width * 0.55, ctx.tex.height * 0.7);
        ctx.tex.scale(1.5 + Easing.easeOutExpo(Easing.zigzag(ctx.beat * 2.0)) * 0.2);
        ctx.tex.image(img, 0, 0);
        ctx.tex.pop();
    },

    drawOverlay: (ctx) => {
        ctx.tex.clear();
        ctx.tex.fill(ctx.colorPalette.accentColor);
        ctx.tex.noStroke();
        const n = 10;
            
        ctx.tex.beginShape();
        for (let i = 0; i < n * 2; i++) {
            const k = i - n < 0 ? -1 : 1;
            const j = Math.abs(i - n);
            const x = map(j, 0, n, 0.03, 0.25) * ctx.tex.width;
            const y = (0.35 + ((j + Math.floor(ctx.beat)) % 2 == 0 ? 0.02 : -0.02) + k * map(Math.abs(j - n / 2), n / 2, 0, 0, 0.03)) * ctx.tex.height;
            ctx.tex.vertex(x, y);
        }
        ctx.tex.endShape(ctx.p.CLOSE);

        ctx.tex.beginShape();
        for (let i = 0; i < n * 2; i++) {
            const k = i - n < 0 ? -1 : 1;
            const j = Math.abs(i - n);
            const x = map(j, 0, n, 0.97, 0.75) * ctx.tex.width;
            const y = (0.35 + ((j + Math.floor(ctx.beat)) % 2 == 0 ? 0.02 : -0.02) + k * map(Math.abs(j - n / 2), n / 2, 0, 0, 0.03)) * ctx.tex.height;
            ctx.tex.vertex(x, y);
        }
        ctx.tex.endShape(ctx.p.CLOSE);
    }
};
