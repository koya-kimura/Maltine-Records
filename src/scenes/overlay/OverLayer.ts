import p5 from "p5";

import { P5Overlay } from "./P5Overlay";
import { APCMiniMK2Manager } from "../../midi/APCMiniMK2Manager";
import { getPalette } from "../../utils/colorPalette";
import { sceneManager } from "../SceneManager";

// 特別なシェーダー処理を適用するシーンIDのリスト
const NOFACE_BOTTOM_SCENE_IDS = ["scene12_noface_bottom"];

export class OverLayer {
    private shader: p5.Shader | null;
    private sourceTexture: p5.Graphics | null;  // 画像を描画するテクスチャ
    private destTexture: p5.Graphics | null;  // エフェクト適用後のテクスチャ
    private p5Overlay: P5Overlay;


    constructor() {
        this.shader = null;
        this.sourceTexture = null;
        this.destTexture = null;
        this.p5Overlay = new P5Overlay();
    }

    /**
         * シェーダーとテクスチャを初期化します。
         * 
         * @param p p5.jsのインスタンス
         */
    async load(p: p5): Promise<void> {
        // エフェクト用のシェーダーを読み込み
        const shaderOrPromise = p.loadShader("/shader/main.vert", "/shader/object.frag");
        if (shaderOrPromise instanceof Promise) {
            this.shader = await shaderOrPromise;
        } else {
            this.shader = shaderOrPromise;
        }

        // エフェクト用のテクスチャを作成（WebGLモード）
        this.sourceTexture = p.createGraphics(p.width, p.height);
        this.destTexture = p.createGraphics(p.width, p.height, p.WEBGL);
    }

    /**
     * エフェクト適用後のテクスチャを取得します。
     * 
     * @returns エフェクト適用後のp5.Graphicsオブジェクト
     */
    getTexture(): p5.Graphics | null {
        return this.destTexture;
    }

    /**
        * エフェクト適用後のテクスチャを指定した座標に描画します。
        * 
        * @param p p5.jsのインスタンス、またはp5.Graphicsオブジェクト。
        */
    draw(p: p5, tex: p5.Graphics, midiManager: APCMiniMK2Manager, beat: number): void {
        if (!this.destTexture || !this.shader || !this.sourceTexture) {
            return;
        }

        const sceneIndex = midiManager.midiInput["sceneSelect"] as number || 0;

        // 1. 画像をsourceTextureに描画（アスペクト比を保持）
        const colorPalette = getPalette(midiManager.midiInput["colorSelect"] as number || 0);
        this.p5Overlay.draw(p, this.sourceTexture, sceneIndex, beat, colorPalette);

        // 
        this.destTexture.push();
        this.destTexture.clear();
        this.destTexture.shader(this.shader);

        this.shader.setUniform("u_tex", this.sourceTexture);
        this.shader.setUniform("u_resolution", [this.sourceTexture.width, this.sourceTexture.height]);
        
        // シーン名でisNofaceBottomを判定
        const currentScene = sceneManager.getScene(sceneIndex);
        const isNofaceBottom = currentScene ? NOFACE_BOTTOM_SCENE_IDS.includes(currentScene.id) : false;
        this.shader.setUniform("u_isNofaceBottom", isNofaceBottom ? 1 : 0);

        this.destTexture.rect(0, 0, this.destTexture.width, this.destTexture.height);
        this.destTexture.pop();

        tex.push();
        tex.image(this.destTexture, 0, 0);

        tex.pop();
    }

    resize(p:p5){
        this.sourceTexture?.resizeCanvas(p.width, p.height);
        this.destTexture?.resizeCanvas(p.width, p.height);
    }
}