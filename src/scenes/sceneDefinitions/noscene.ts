// Scene 01: Noface Cycling
import type { SceneDefinition } from "../SceneManager";

export const noscene: SceneDefinition = {
    id: "scene01_noface_cycling",
    name: "Noface Cycling",

    drawImage: (_ctx) => {
    },

    drawOverlay: (ctx) => {
        ctx.tex.clear();
    }
};
