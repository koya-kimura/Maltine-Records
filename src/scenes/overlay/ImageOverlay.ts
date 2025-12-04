import p5 from "p5";
import { ImageAnimation } from "../image/ImageAnimation";
import { ImageGallery } from "../image/ImageGallery";

export class ImageOverlay {
    draw(p: p5, tex: p5.Graphics, imageAnimation: ImageAnimation, imageGallery: ImageGallery): void {
        tex.push();
        // 最終オーバーレイしたくなったら使う
        tex.pop();
    }
}