// Scene 20: Step Animation
import type { SceneDefinition } from "../SceneManager";
import { Easing } from "../../utils/easing";
import { GVM } from "../../utils/gvm";

export const scene23: SceneDefinition = {
    id: "scene22_step",
    name: "Step Animation",

    drawImage: (ctx) => {
        ctx.tex.push();
        ctx.tex.pop();
    },

    drawOverlay: (ctx) => {
        ctx.tex.clear();
        // empty overlay
    }
};
