// Scene 12: Noface Bottom
import type { SceneDefinition } from "../SceneManager";
import { UniformRandom } from "../../utils/uniformRandom";

export const scene12: SceneDefinition = {
    id: "scene12_noface_bottom",
    name: "Noface Bottom",

    drawImage: (ctx) => {
        const img = ctx.imageGallery.getImage("noface", Math.floor(UniformRandom.rand(Math.floor(ctx.beat * 0.5), 0) * 4));
        ctx.tex.push();
        ctx.tex.imageMode(ctx.p.CENTER);
        ctx.tex.translate(ctx.tex.width * 0.5, ctx.tex.height * 1.6);
        ctx.tex.scale(2.5);
        ctx.tex.image(img, 0, 0);
        ctx.tex.pop();
    },

    drawOverlay: (ctx) => {
        ctx.tex.clear();
        // empty overlay
    }
};
