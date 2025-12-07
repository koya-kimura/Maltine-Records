// Scene 09: Walk Animation x3
import type { SceneDefinition } from "../SceneManager";
import { Easing } from "../../utils/easing";
import { UniformRandom } from "../../utils/uniformRandom";
import { fract } from "../../utils/mathUtils";

export const FaceGrid: SceneDefinition = {
    id: "scene09_walk_x3",
    name: "Walk Animation x3",

    drawImage: (ctx) => {
        ctx.tex.push();
        ctx.tex.pop();
    },

    drawOverlay: (ctx) => {
        ctx.tex.clear();

        const gridSize = 3;
        const cellWidth = ctx.tex.width / gridSize;
        const cellHeight = ctx.tex.height / gridSize;

        ctx.tex.push();
        ctx.tex.stroke(255, 100);
        ctx.tex.noFill();
        for (let i = 0; i < gridSize; i++) {
            for (let j = -1; j < gridSize; j++) {
                const x = i * cellWidth;
                const y = j * cellHeight + Easing.easeOutExpo(fract(ctx.beat)) * cellHeight;
                const s = Math.min(cellWidth, cellHeight) * 0.6;

                ctx.tex.push();
                ctx.tex.translate(x + cellWidth / 2, y + cellHeight / 2);

                ctx.tex.noStroke();
                ctx.tex.fill(ctx.colorPalette.accentColor);
                ctx.tex.ellipse(0, 0, s, s);

                const gapx = (UniformRandom.rand(Math.floor(ctx.beat), i * 13 + j * 7) - 0.5) * s * 0.2;
                const gapy = (UniformRandom.rand(Math.floor(ctx.beat), i * 17 + j * 11) - 0.5) * s * 0.2;
                ctx.tex.translate(gapx, gapy);
                ctx.tex.fill(255);
                ctx.tex.ellipse(0, 0, s * 0.67, s * 0.67);

                const angle = Easing.easeInOutSine((ctx.beat % 1)) * Math.PI * 2;
                const eyeOffsetX = Math.cos(angle) * s * 0.1;
                const eyeOffsetY = Math.sin(angle) * s * 0.1;
                const eyeSize = s * 0.3;

                // 黒目
                ctx.tex.translate(eyeOffsetX, eyeOffsetY);
                ctx.tex.fill(0);
                ctx.tex.ellipse(0, 0, eyeSize, eyeSize);

                ctx.tex.pop();

            }
        }
        ctx.tex.pop();
    }
};
