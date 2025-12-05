// Scene 01: Noface Cycling
import type { SceneDefinition } from "../SceneManager";

export const noscene: SceneDefinition = {
    id: "scene01_noface_cycling",
    name: "Noface Cycling",

    drawImage: (ctx) => {
    },

    drawOverlay: (ctx) => {
        const s = Math.min(ctx.tex.width, ctx.tex.height) * 0.25;
        ctx.tex.clear();
    }
};
