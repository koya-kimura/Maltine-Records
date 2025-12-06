// Scene 20: Step Animation
import type { SceneDefinition } from "../SceneManager";
import { Easing } from "../../utils/easing";
import { GVM } from "../../utils/gvm";
import { UniformRandom } from "../../utils/uniformRandom";
import { map } from "../../utils/mathUtils";

export const scene22: SceneDefinition = {
    id: "scene22_step",
    name: "Step Animation",

    drawImage: (ctx) => {
        ctx.tex.push();
        const n = 30;
        for (let i = 0; i < n; i++) {
            const t = ctx.beat * 0.0675 + i * 0.3;
            const count = Math.floor(t);
            const progress = t - count;
            const x = Math.floor(UniformRandom.rand(count * 87401, i) * 20.0 + 0.5) / 20.0 * ctx.tex.width;
            const y = map(progress, 0, 1, ctx.tex.height * 2.0, -ctx.tex.height * 1.0);
            const scl = map(Math.pow(UniformRandom.rand(count * 87401 + 1, i), 2), 0, 1, 0.4, 0.7);

            let img;

            const isAnimation = UniformRandom.rand(count * 5678 + 3, i) < 0.5;
            if (isAnimation) {
                const labels = ctx.imageAnimation.getLabels();
                const label = labels[Math.floor(UniformRandom.rand(count * 1389 + 2, i) * labels.length)];
                const animationNums = ctx.imageAnimation.getLength(label);
                const animationNum = Math.floor(UniformRandom.rand(count * 2468 + 3, i) * animationNums);
                img = ctx.imageAnimation.getImage(label, animationNum, Easing.zigzag(progress * 0.2));
            } else {
                const labels = ctx.imageGallery.getLabels();
                const label = labels[Math.floor(UniformRandom.rand(count * 2468 + 4, i) * labels.length)];
                const imageNums = ctx.imageGallery.getLength(label);
                const imageNum = Math.floor(UniformRandom.rand(count * 1357 + 5, i) * imageNums);
                img = ctx.imageGallery.getImage(label, imageNum);
            }

            ctx.tex.push();
            ctx.tex.imageMode(ctx.p.CENTER);
            ctx.tex.translate(x, y);
            ctx.tex.scale(scl);
            ctx.tex.image(img, 0, 0);
            ctx.tex.pop();
        }
        ctx.tex.pop();
    },

    drawOverlay: (ctx) => {
        ctx.tex.clear();
        // empty overlay
    }
};
