// Scene 02: Animal 0
import type { SceneDefinition } from "../SceneManager";
import { GVM } from "../../utils/gvm";
import { Easing } from "../../utils/easing";
import { map } from "../../utils/mathUtils";
import { UniformRandom } from "../../utils/uniformRandom";

export const Building: SceneDefinition = {
    id: "scene02_building_0",
    name: "Building 0",

    drawImage: (ctx) => {
        const n = 20;
        for(let i = 0; i < n; i++){
            const img = ctx.imageGallery.getImage("building", UniformRandom.rand(i) < 0.5 ? 0 : 1);
            const scl = map(Math.pow(GVM.leapNoise(ctx.beat, 17+i, 13, Easing.easeOutQuad, i + 2000), 3), 0, 1, 0.25, 0.9);
            // const aspX = map(Easing.easeOutExpo(Easing.zigzag(ctx.beat * 1.5001)), 0, 1, 0.98, 1.05);
            // const aspY = map(Easing.easeOutQuad(Easing.zigzag(ctx.beat * 1.5)), 0, 1, 0.99, 1.01);

            const x = map(GVM.leapNoise(ctx.beat+i, 13, 6, Easing.easeOutQuad, i * 12345), 0, 1, 0, ctx.tex.width);
            const y = ctx.tex.height - scl * img.height * 0.5;
            
            ctx.tex.push();
            ctx.tex.translate(x, y);
            ctx.tex.imageMode(ctx.p.CENTER);
            ctx.tex.scale(scl, scl);
            ctx.tex.image(img, 0, 0);
            ctx.tex.pop();
        }
    },

    drawOverlay: (ctx) => {
        ctx.tex.clear();
    }
};
