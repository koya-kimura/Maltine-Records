import p5 from "p5";


export class P5Overlay {
    draw(p: p5 | p5.Graphics, sceneIndex: number, beat: number){
        p.push();
        p.clear();
        for(let i = 0; i < 10; i ++){
            const d = Math.min(p.width, p.height) * (Math.sin(beat * 0.1 + i * 0.1 * Math.PI * 2.0) + 1) * 0.15;

            p.strokeWeight(10);
            p.noFill();
            p.stroke(200, 10, 100);
            p.circle(p.width/2, p.height/2, d)
        }
        p.pop();
    }
}