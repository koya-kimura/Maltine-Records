// Scene 02: Animal 0
import type { SceneDefinition } from "../SceneManager";
import { GVM } from "../../utils/gvm";
import { Easing } from "../../utils/easing";
import { map, fract } from "../../utils/mathUtils";

export const AnimalMarching: SceneDefinition = {
    id: "scene02_animal_0",
    name: "Animal 0",

    drawImage: (ctx) => {
        const img = ctx.imageGallery.getImage("animal", 0);
        const angle = map(Easing.zigzag(GVM.leapRamp(ctx.beat, 8, 2) * 16.0), 0, 1, -Math.PI * 0.02, Math.PI * 0.02);
        const scl = map(Easing.zigzag(GVM.leapRamp(ctx.beat, 8, 2) * 16.0), 0, 1, 0.55, 0.6);

        const n = 15;
        for (let i = 0; i < n; i++) {
            const m = fract(GVM.leapRamp(ctx.beat, 8, 2)) * n;
            const x = map(i, 0, n - 1, ctx.tex.width * 0.25, ctx.tex.width * 1.1);
            if (i > m) continue;
            ctx.tex.push();
            ctx.tex.translate(Math.sin(ctx.beat * 0.5) * 0.03 * ctx.tex.width, 0);
            ctx.tex.imageMode(ctx.p.CENTER);
            ctx.tex.translate(x, ctx.tex.height * 0.65);
            ctx.tex.rotate(angle);
            ctx.tex.scale(scl);
            ctx.tex.image(img, 0, 0);
            ctx.tex.pop();
        }
    },

    drawOverlay: (ctx) => {
        ctx.tex.clear();
        const n = 10;
        const p1 = { x: ctx.tex.width * 0.45, y: ctx.tex.height * 0.4 };
        const p2 = { x: ctx.tex.width * 0.7, y: ctx.tex.height * 0.2 };
        for (let i = 0; i < n; i++) {
            const t = GVM.leapRamp(ctx.beat, 8, 2) * Math.PI * 1.5 + ctx.beat * 0.3 + i;
            const x = map(Math.sin(t), -1, 1, p1.x, p2.x);
            const y = map(Math.sin(t), -1, 1, p1.y, p2.y);
            const s = map(Math.sin(t), -1, 1, 0.3, 0.5) * (Math.sin(ctx.beat + i * 0.5) * 0.5 + 0.5) * Math.min(ctx.tex.width, ctx.tex.height) * 0.3;
            const c = ctx.colorPalette.accentColor;

            ctx.tex.stroke(c);
            ctx.tex.noFill();
            ctx.tex.circle(x, y, s);

            ctx.tex.noStroke();
            ctx.tex.fill(c);
            ctx.tex.circle(x, y, s * 0.85);
        }
    }
};
