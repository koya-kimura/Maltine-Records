// Scene 15: Life 1 Falling
import type { SceneDefinition } from "../SceneManager";
import { UniformRandom } from "../../utils/uniformRandom";
import { map } from "../../utils/mathUtils";

export const scene15: SceneDefinition = {
    id: "scene15_life_1_falling",
    name: "Life 1 Falling",

    drawImage: (ctx) => {
        const img = ctx.imageGallery.getImage("life", 1);
        for (let i = 0; i < 10; i++) {
            const sp = map(UniformRandom.rand(i * 1234), 0, 1, 0.1, 0.2);
            const seed = Math.floor(UniformRandom.rand(i * 5678) * 10.0 + ctx.beat * sp);
            const x = UniformRandom.rand(i * 1234, seed) * ctx.tex.width;
            const y = map((UniformRandom.rand(i * 5678) * 10.0 + ctx.beat * sp) % 1, 0, 1, -0.5, 1.5) * ctx.tex.height;
            const angle = UniformRandom.rand(i * 91011) * Math.PI * 2 + ctx.beat * map(UniformRandom.rand(i * 1213), 0, 1, 0.2, 0.5);
            const scl = map(Math.pow(UniformRandom.rand(i * 1213, seed), 2), 0, 1, 0.3, 0.7);

            ctx.tex.push();
            ctx.tex.imageMode(ctx.p.CENTER);
            ctx.tex.translate(x, y);
            ctx.tex.rotate(angle);
            ctx.tex.scale(scl);
            ctx.tex.image(img, 0, 0);
            ctx.tex.pop();
        }
    },

    drawOverlay: (ctx) => {
        ctx.tex.clear();
        // empty overlay
    }
};
