import p5 from "p5";

import { GVM } from "../../utils/gvm";
import { map, fract } from "../../utils/mathUtils";
import { Easing } from "../../utils/easing";
import { UniformRandom } from "../../utils/uniformRandom";


export class P5Overlay {
    draw(p: p5, tex: p5.Graphics, sceneIndex: number, beat: number) {
        if (sceneIndex === 0) {
            tex.push();
            tex.clear();
            // 何もなし
            tex.pop();
        }
        else if (sceneIndex === 1) {
            const s = Math.min(tex.width, tex.height) * 0.25;

            tex.push();
            tex.clear();
            tex.noStroke();
            tex.fill(220, 220, 10);
            tex.circle(tex.width / 2, tex.height * 0.18, s);

            for (let i of [-1, 1]) {
                tex.push();
                tex.translate(i * s * 0.2, 0);
                tex.fill(255);
                tex.circle(tex.width / 2, tex.height * 0.18, s * 0.3);

                const angle = beat * 0.5;
                const gapx = Math.cos(angle) * s * 0.1;
                const gapy = Math.sin(angle) * s * 0.1;
                tex.fill(10);
                tex.circle(tex.width / 2 + gapx, tex.height * 0.18 + gapy, s * 0.1);
                tex.pop();
            }
            tex.pop();
        }
        else if (sceneIndex === 2) {
            tex.push();
            tex.clear();
            const n = 10;
            const p1 = { x: tex.width * 0.45, y: tex.height * 0.4 };
            const p2 = { x: tex.width * 0.7, y: tex.height * 0.2 };
            for (let i = 0; i < n; i++) {
                const t = GVM.leapRamp(beat, 8, 2) * Math.PI * 0.5 + beat * 0.3 + i;
                const x = map(Math.sin(t), -1, 1, p1.x, p2.x);
                const y = map(Math.sin(t), -1, 1, p1.y, p2.y);
                const s = map(Math.sin(t), -1, 1, 0.3, 0.5) * (Math.sin(beat + i * 0.5) * 0.5 + 0.5) * Math.min(tex.width, tex.height) * 0.3;
                const c = p.color(200, 200, 30);

                tex.stroke(c);
                tex.noFill();
                tex.circle(x, y, s);

                tex.noStroke();
                tex.fill(c);
                tex.circle(x, y, s * 0.85);
            }
            tex.pop();
        }
        else if (sceneIndex === 3) {
            tex.push();
            tex.clear();
            const s = Math.min(tex.width, tex.height) * 0.25;

            tex.push();
            tex.clear();
            tex.noStroke();
            tex.fill(220, 220, 10);
            tex.circle(tex.width * 0.3, tex.height * 0.5, s);
            tex.circle(tex.width * 0.43, tex.height * 0.45, s);

            tex.fill(255, 100, 0);
            tex.circle(tex.width * 0.3, tex.height * 0.5, s * map(Easing.zigzag(beat), 0, 1, 0.7, 0.9));
            tex.circle(tex.width * 0.43, tex.height * 0.45, s * map(Easing.zigzag(beat), 0, 1, 0.7, 0.9));
            tex.pop();
        }
        else if (sceneIndex === 4) {
            tex.push();
            tex.clear();

            const n = 40;
            const sclX = map(Easing.easeOutCubic(Easing.zigzag(beat)), 0, 1, 0.8, 1.2);
            const sclY = map(Easing.easeOutQuad(Easing.zigzag(beat)), 0, 1, 0.8, 1.2);

            tex.push();
            tex.translate(tex.width * 0.5, tex.height * 0.6);
            tex.scale(sclX, sclY);
            tex.strokeWeight(Math.min(tex.width, tex.height) * 0.01);
            tex.fill(255, 200, 0);
            tex.beginShape();
            for (let i = 0; i < n; i++) {
                const angle = (i / n) * Math.PI * 2 + beat * 0.3;
                const radius = Math.min(tex.width, tex.height) * (i % 2 == 0 ? 0.8 : 1.2) * 0.3 * map(GVM.leapNoise(beat, 8, 2, Easing.easeOutExpo, UniformRandom.rand(i * 47819)), 0, 1, 0.7, 1.0);
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                tex.vertex(x, y);
            }
            tex.endShape(p.CLOSE);
            tex.pop();

            tex.pop();
        }
        else if (sceneIndex === 5) {
            tex.push();
            tex.clear();

            const s = Math.min(tex.width, tex.height) * 0.07;
            const alpha = map(Math.sin(beat * 0.2), -1, 1, 50, 200);
            tex.noStroke();
            tex.fill(30, 200, 10, alpha);
            tex.circle(tex.width * 0.43, tex.height * 0.3, s);
            tex.pop();
        }
        else if (sceneIndex === 6) {
            tex.push();
            tex.clear();

            const s = Math.min(tex.width, tex.height) * 0.15;
            const y = map(Easing.easeInOutCubic((beat * 0.5) % 1), 0, 1, tex.height * 0.4, tex.height * 1.3);
            tex.noStroke();
            tex.fill(30, 50, 200);
            tex.circle(tex.width * 0.41, y, s);
            tex.pop();
        }
        else if (sceneIndex === 7) {
            tex.push();
            tex.clear();
            for(let i = 0; i < 20; i++){
                const t = fract(beat * 0.3 + i*0.1);
                const x = map(t, 0, 1, tex.width * 0.6, -tex.width * 0.1);
                const y = map(Easing.easeInSine(Math.abs(t - 0.5)*2), 1, 0, tex.height * 0.5, tex.height * map(UniformRandom.rand(i * 5281), 0, 1, 0.2, 0.45));
                const s = map(Easing.easeOutQuad(t), 0, 1, 0.02, 0.2) * Math.min(tex.width, tex.height) * map(Easing.easeOutQuint(Easing.zigzag(beat)), 0, 1, 0.5, 1.0);
                const c = p.color(Math.floor(UniformRandom.rand(i * 5281)*5)/ 5 * 255, 220, 20);
                
                tex.fill(c);
                tex.noStroke();
                tex.circle(x, y, s);
            }
            tex.pop();
        }
        else if (sceneIndex === 8) {
            tex.push();
            tex.clear();
        
            tex.fill(255, 255, 0);
            tex.noStroke();
            tex.beginShape();
            const n = 10;
            for(let i = 0; i < n * 2; i++){
                const k = i - n < 0 ? -1 : 1;
                const j = Math.abs(i - n);
                const x = map(j, 0, n, 0.03, 0.25) * tex.width;
                const y = (0.35 + (j % 2 == 0 ? 0.02 : -0.02) + k * map(Math.abs(j-n/2),  n/2, 0, 0, 0.03)) * tex.height;
                tex.vertex(x, y);
            }
            tex.endShape(p.CLOSE);

            tex.pop();
        }
        else if (sceneIndex === 9) {
            tex.push();
            tex.clear();
            // TODO: 思いついてない

            tex.pop();
        }
         else if (sceneIndex === 10) {
            tex.push();
            tex.clear();
            for(let i = 0; i < 20; i++){
                const t = fract(beat * 0.4 + i*0.15);
                const x = map(t, 0, 1, tex.width * 0.6, tex.width * map(UniformRandom.rand(i * 7821), 0, 1, 0.4, 0.8)) + Math.sin(beat + i) * tex.width * 0.01;
                const y = map(t, 0, 1, tex.height * 0.5, -tex.height * 0.1);
                const s = map(Easing.easeOutQuad(t), 0, 1, 0.02, 0.25) * Math.min(tex.width, tex.height) * map(Easing.easeOutQuint(Easing.zigzag(beat)), 0, 1, 0.5, 1.0);
                const c = p.color(255, Math.floor(UniformRandom.rand(i * 7821)*5)/ 5 * 255, 20, 50);
                
                tex.fill(c);
                tex.noStroke();
                tex.circle(x, y, s);
            }
            tex.pop();
        }
    }
}