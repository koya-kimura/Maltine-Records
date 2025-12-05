// ImageRenderer は画像の描画処理を管理するクラス。
// SceneManagerから取得したシーン定義を使用して描画を行う。
import p5 from "p5";
import { ImageAnimation } from "./ImageAnimation";
import { ImageGallery } from "./ImageGallery";
import { sceneManager, type ImageSceneContext } from "../SceneManager";

// シーン定義を登録（このインポートにより全シーンが登録される）
import "../sceneDefinitions/index";

/**
 * ImageRendererクラス
 * SceneManagerのシーン定義を使用して画像を描画
 */
export class ImageRenderer {
    /**
     * シーンインデックスに応じて画像を描画
     */
    draw(
        p: p5,
        tex: p5.Graphics,
        imageAnimation: ImageAnimation,
        imageGallery: ImageGallery,
        beat: number,
        sceneIndex: number,
    ): void {
        const scene = sceneManager.getScene(sceneIndex);
        if (!scene?.drawImage) return;

        const ctx: ImageSceneContext = {
            p,
            tex,
            imageAnimation,
            imageGallery,
            beat
        };

        tex.push();
        scene.drawImage(ctx);
        tex.pop();
    }

    /**
     * 登録済みシーン数を取得
     */
    getSceneCount(): number {
        return sceneManager.sceneCount;
    }
}
