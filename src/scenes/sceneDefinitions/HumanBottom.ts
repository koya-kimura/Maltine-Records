// Scene 06: Human 1
import type { SceneDefinition } from "../SceneManager";
import { Easing } from "../../utils/easing";

import { map } from "../../utils/mathUtils";
import { GVM } from "../../utils/gvm";
import { fract } from "../../utils/mathUtils";

export const HumanBottom: SceneDefinition = {
    id: "scene06_human_1",
    name: "Human 1",

    drawImage: (ctx) => {
        const n = 50;
        for(let i = 0; i < n; i++){
            const camera = ctx.imageGallery.getImage("life", 5);
            const x = map(GVM.leapNoise(ctx.beat, 4, 1, Easing.easeOutQuad, i * 74520), 0, 1, 0, ctx.tex.width);
            const y = map(GVM.leapNoise(ctx.beat, 4, 1, Easing.easeOutQuad, i * 47022), 0, 1, 0, ctx.tex.height);
            const scl = map(Math.pow(GVM.leapNoise(ctx.beat, 4, 1, Easing.easeOutQuad, i + 2000), 2), 0, 1, 0.1, 0.5);
            const aspX = map(Easing.easeOutExpo(Easing.zigzag(ctx.beat * 1.5001)), 0, 1, 0.9, 1.2);
            const aspY = map(Easing.easeOutQuad(Easing.zigzag(ctx.beat * 1.5)), 0, 1, 0.95, 1.1);
            const angle = GVM.leapNoise(ctx.beat, 4, 1, Easing.easeOutQuad, i) * Math.PI * 3;

            ctx.tex.push();
            ctx.tex.translate(x, y);
            ctx.tex.imageMode(ctx.p.CENTER);
            ctx.tex.scale(scl*aspX, scl*aspY);
            ctx.tex.rotate(angle);
            ctx.tex.image(camera, 0, 0);
            ctx.tex.pop();
        }

        const img = ctx.imageGallery.getImage("human", 1);
        const xgap = map(Easing.easeOutQuint(Easing.zigzag(ctx.beat)), 1, 0, 0, ctx.tex.width * 0.3) * (Math.floor(ctx.beat)%2 == 0 ? -1 : 1); 
        ctx.tex.push();
        ctx.tex.imageMode(ctx.p.CENTER);
        ctx.tex.translate(ctx.tex.width * 0.5 + xgap, ctx.tex.height * 0.9);
        ctx.tex.scale(2.5);
        ctx.tex.image(img, 0, 0);
        ctx.tex.pop();
    },

    drawOverlay: (ctx) => {
        ctx.tex.clear();

        if(fract(ctx.beat * 0.5) < 0.1){
            const flashAlpha = Easing.easeOutQuad(map(fract(ctx.beat * 0.5), 0, 0.05, 1, 0));
            ctx.tex.push();
            ctx.tex.fill(255, 255 * flashAlpha);
            ctx.tex.noStroke();
            ctx.tex.rect(0, 0, ctx.tex.width, ctx.tex.height);
            ctx.tex.pop();
        }
    }
};