// Scene 04: Animal 2 Mirrored
import type { SceneDefinition } from "../SceneManager";
import { GVM } from "../../utils/gvm";
import { Easing } from "../../utils/easing";
import { UniformRandom } from "../../utils/uniformRandom";
import { map } from "../../utils/mathUtils";

export const AnimalMirrored: SceneDefinition = {
    id: "scene04_animal_2_mirrored",
    name: "Animal 2 Mirrored",

    drawImage: (ctx) => {
        const img = ctx.imageGallery.getImage("animal", 2);
        ctx.tex.push();
        ctx.tex.imageMode(ctx.p.CENTER);

        ctx.tex.push();
        ctx.tex.translate(ctx.tex.width * 0.05, ctx.tex.height * 0.5);
        ctx.tex.scale(1.2);
        ctx.tex.image(img, 0, 0);
        ctx.tex.pop();

        ctx.tex.push();
        ctx.tex.translate(ctx.tex.width * 0.95, ctx.tex.height * 0.5);
        ctx.tex.scale(-1, 1);
        ctx.tex.scale(1.2);
        ctx.tex.image(img, 0, 0);
        ctx.tex.pop();
        ctx.tex.pop();
    },

    drawOverlay: (ctx) => {
        ctx.tex.clear();

        const n = 40;
        const sclX = map(Easing.easeOutCubic(Easing.zigzag(ctx.beat)), 0, 1, 0.8, 1.2);
        const sclY = map(Easing.easeOutQuad(Easing.zigzag(ctx.beat)), 0, 1, 0.8, 1.2);

        ctx.tex.push();
        ctx.tex.translate(ctx.tex.width * 0.5, ctx.tex.height * 0.6);
        ctx.tex.scale(sclX, sclY);
        ctx.tex.strokeWeight(Math.min(ctx.tex.width, ctx.tex.height) * 0.01);
        ctx.tex.fill(ctx.colorPalette.accentColor);
        ctx.tex.beginShape();
        for (let i = 0; i < n; i++) {
            const angle = (i / n) * Math.PI * 2 + ctx.beat * 0.3;
            const radius = Math.min(ctx.tex.width, ctx.tex.height) * (i % 2 == 0 ? 0.8 : 1.2) * 0.3 * map(GVM.leapNoise(ctx.beat, 8, 2, Easing.easeOutExpo, UniformRandom.rand(i * 47819)), 0, 1, 0.7, 1.0);
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            ctx.tex.vertex(x, y);
        }
        ctx.tex.endShape(ctx.p.CLOSE);
        ctx.tex.pop();
    }
};
