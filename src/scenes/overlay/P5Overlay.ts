// P5Overlay はオーバーレイ描画を管理するクラス。
// SceneManagerから取得したシーン定義を使用して描画を行う。
import p5 from "p5";
import { sceneManager, type OverlaySceneContext, type ColorPalette } from "../SceneManager";

// シーン定義を登録（このインポートにより全シーンが登録される）
// 注意: ImageRendererで既にインポート済みの場合は重複登録されない
import "../sceneIndex";

/**
 * P5Overlayクラス
 * SceneManagerのシーン定義を使用してオーバーレイを描画
 */
export class P5Overlay {
    /**
     * シーンインデックスに応じてオーバーレイを描画
     */
    draw(
        p: p5, 
        tex: p5.Graphics, 
        sceneIndex: number, 
        beat: number, 
        colorPalette: ColorPalette
    ): void {
        const scene = sceneManager.getScene(sceneIndex);
        if (!scene?.drawOverlay) return;

        const ctx: OverlaySceneContext = {
            p,
            tex,
            beat,
            colorPalette
        };

        tex.push();
        scene.drawOverlay(ctx);
        tex.pop();
    }

    /**
     * 登録済みシーン数を取得
     */
    getSceneCount(): number {
        return sceneManager.sceneCount;
    }
}
