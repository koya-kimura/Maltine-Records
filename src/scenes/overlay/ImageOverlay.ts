import p5 from "p5";
import { ImageAnimation } from "../image/ImageAnimation";
import { ImageGallery } from "../image/ImageGallery";

export class ImageOverlay {
    draw(_p: p5, tex: p5.Graphics, _imageAnimation: ImageAnimation, _imageGallery: ImageGallery): void {
        tex.push();
        // 最終オーバーレイしたくなったら使う
        tex.pop();
    }
}