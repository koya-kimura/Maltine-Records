// Scene 20: Step Animation
import type { SceneDefinition } from "../SceneManager";
import { Easing } from "../../utils/easing";
import { map } from "../../utils/mathUtils";
import { GVM } from "../../utils/gvm";

export const StopMachine: SceneDefinition = {
    id: "scene20_step",
    name: "Step Animation",

    drawImage: (ctx) => {
        const n = 10;
        const m = Math.floor(n * ctx.tex.height / ctx.tex.width);
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < m; j++) {
                const img1 = ctx.imageGallery.getImage("life", 7);
                const x = map(i + 0.5, 0, n, 0, ctx.tex.width);
                const y = map(j + 0.5, 0, m, 0, ctx.tex.height);
                const scl = 0.2;

                if(GVM.leapNoise(ctx.beat, 4, 1, Easing.easeInOutSine, i * 1234 + j * 5678) < 0.5) continue;
                ctx.tex.push();
                ctx.tex.imageMode(ctx.p.CENTER);
                ctx.tex.translate(x, y);
                ctx.tex.scale(scl);
                ctx.tex.image(img1, 0, 0);
                ctx.tex.pop();
            }
        }
    },

    drawOverlay: (ctx) => {
        ctx.tex.clear();
                const n = 10;
        const m = Math.floor(n * ctx.tex.height / ctx.tex.width);
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < m; j++) {
                const x = map(i + 0.5, 0, n, 0, ctx.tex.width);
                const y = map(j + 0.5, 0, m, 0, ctx.tex.height);
                const scl = 0.03;

                if(GVM.leapNoise(ctx.beat * 2.0, 2, 1, Easing.easeInOutSine, i * 78490 + j * 16720) < 0.5) continue;
                ctx.tex.push();
                ctx.tex.fill(ctx.colorPalette.accentColor);
                ctx.tex.noStroke();
                ctx.tex.translate(x, y);
                ctx.tex.rectMode(ctx.p.CENTER);
                ctx.tex.rect(0, 0, scl * Math.min(ctx.tex.width, ctx.tex.height) * 3.0, scl * Math.min(ctx.tex.width, ctx.tex.height) * 4.0);
                ctx.tex.pop();
            }
        }
    }
};
