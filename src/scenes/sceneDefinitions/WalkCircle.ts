// Scene 16: Walk Circle
import type { SceneDefinition } from "../SceneManager";
import { GVM } from "../../utils/gvm";
import { map, fract } from "../../utils/mathUtils";

export const WalkCircle: SceneDefinition = {
    id: "scene16_walk_circle",
    name: "Walk Circle",

    drawImage: (ctx) => {
        const n = 3;
        for (let j = 0; j < n; j++) {
            const m = map(j, 0, n - 1, 12, 5);
            for (let i = 0; i < m; i++) {
                const radius = Math.min(ctx.tex.width, ctx.tex.height) * map(j, 0, n - 1, 0.8, 0.25);
                const angle = (i / m) * Math.PI * 2 + ctx.beat * 0.125 + j * 0.2 + GVM.leapRamp(ctx.beat, 8, 2) * 0.25 * Math.PI + j * 0.1;
                const x = Math.cos(angle) * radius + ctx.tex.width / 2;
                const y = Math.sin(angle) * radius + ctx.tex.height / 2;
                const imgIndex = (j + i) % 4;
                const img = ctx.imageAnimation.getImage("walk", imgIndex, fract(ctx.beat * 0.1 + i * 0.1 + j * 0.2 + GVM.leapRamp(ctx.beat, 8, 2) * 0.25));

                ctx.tex.push();
                ctx.tex.imageMode(ctx.p.CENTER);
                ctx.tex.translate(x, y);
                ctx.tex.rotate(angle + Math.PI / 2);
                ctx.tex.scale(0.45);
                ctx.tex.image(img, 0, 0);
                ctx.tex.pop();
            }
        }
    },

    drawOverlay: (ctx) => {
        ctx.tex.clear();
        // empty overlay
    }
};
