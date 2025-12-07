// EffectManager はポストエフェクト用のシェーダーを読み込み適用する責務を持つ。
import p5 from "p5";
import { colorcode2rgbArray } from "../utils/mathUtils";
import { APCMiniMK2Manager } from "../midi/APCMiniMK2Manager";
import { getPalette } from "../utils/colorPalette";

export class EffectManager {
    private shader: p5.Shader | null;

    // constructor は空のシェーダー参照を初期化する。
    constructor() {
        this.shader = null;
    }

    /**
     * 指定されたパスから頂点シェーダーとフラグメントシェーダーを非同期で読み込みます。
     * p5.jsのloadShader関数を使用し、シェーダーオブジェクトを作成してクラス内部に保持します。
     * 読み込み処理がPromiseを返す場合（特定のp5.jsのバージョンや環境など）にも対応しており、
     * async/awaitを用いてシェーダーのロード完了を確実に待機します。
     * これにより、描画ループが開始される前にシェーダーリソースが確実に利用可能な状態になることを保証します。
     *
     * @param p p5.jsのインスタンス。シェーダーのロード機能を提供します。
     * @param vertPath 頂点シェーダーファイルのパス（.vert）。
     * @param fragPath フラグメントシェーダーファイルのパス（.frag）。
     * @returns シェーダーの読み込みが完了した後に解決されるPromise。
     */
    async load(p: p5, vertPath: string, fragPath: string): Promise<void> {
        const shaderOrPromise = p.loadShader(vertPath, fragPath);

        if (shaderOrPromise instanceof Promise) {
            this.shader = await shaderOrPromise;
        } else {
            this.shader = shaderOrPromise;
        }
    }

    /**
     * 現在のフレームに対してポストエフェクトシェーダーを適用し、最終的な描画を行います。
     * 複数のテクスチャ（ソース、UI、キャプチャ）と、MIDIコントローラーなどからの入力値（フェーダー、グリッド）を
     * シェーダーのUniform変数として設定します。
     * これにより、モザイク、波形歪み、色反転、ジッターなどのエフェクトを動的に制御します。
     * また、全体の不透明度や背景シーンの回転タイプなどもここで反映されます。
     * 最後に画面全体を覆う矩形を描画することで、シェーダーの効果をキャンバス全体に適用します。
     *
     * @param p p5.jsのインスタンス。
     * @param sourceTexture メインの描画内容が含まれるグラフィックスオブジェクト。
     * @param uiTexture UI要素（テキストなど）が含まれるグラフィックスオブジェクト。
     * @param captureTexture 以前のフレームやカメラ入力などのキャプチャ用テクスチャ。
     * @param faderValues MIDIフェーダーからの入力値配列。エフェクトの強度制御に使用。
     * @param gridValues MIDIグリッドボタンからの入力値配列。シーン切り替えなどに使用。
     * @param beat 現在のビート情報。リズムに合わせたエフェクト同期に使用。
     * @param colorPaletteRGBArray カラーパレットのRGB値がフラットに並んだ配列。
     */
    apply(p: p5, sourceTexture: p5.Graphics, uiTexture: p5.Graphics, captureTexture: p5.Graphics, midiManager: APCMiniMK2Manager, beat: number, keyVisual: p5.Image | undefined): void {
        if (!this.shader) {
            return;
        }

        const colorPalette = getPalette((midiManager.midiInput["colorSelect"] as number || 0) % (Math.pow(2, (midiManager.midiInput["limitSelect"] as number) + 1)));
        const patternIndex = (midiManager.midiInput["patternSelect"] as number || 0) % (Math.pow(2, (midiManager.midiInput["limitSelect"] as number) + 1));

        p.shader(this.shader);
        this.shader.setUniform("u_beat", beat);
        this.shader.setUniform("u_tex", sourceTexture);
        this.shader.setUniform("u_uiTex", uiTexture);
        this.shader.setUniform("u_captureTex", captureTexture);
        this.shader.setUniform("u_resolution", [p.width, p.height]);
        this.shader.setUniform("u_time", p.millis() / 1000.0);
        this.shader.setUniform("u_mainColor", colorcode2rgbArray(colorPalette.mainColor)); // 例: 赤色
        this.shader.setUniform("u_subColor", colorcode2rgbArray(colorPalette.subColor)); // 例: 青色
        this.shader.setUniform("u_patternIndex", patternIndex); // 例: パターンインデックス1

        this.shader.setUniform("u_faderValues", [
            midiManager.faderValues[0],
            midiManager.faderValues[1],
            midiManager.faderValues[2],
            midiManager.faderValues[3],
            midiManager.faderValues[4],
            midiManager.faderValues[5],
            midiManager.faderValues[6],
            midiManager.faderValues[7],
            midiManager.faderValues[8],
        ]);

        this.shader.setUniform("u_backShadowToggle", midiManager.midiInput["backShadowToggle"]);
        this.shader.setUniform("u_vibeToggle", midiManager.midiInput["vibeToggle"]);
        this.shader.setUniform("u_keyVisualTex", keyVisual ? keyVisual : p.createGraphics(1, 1));
        this.shader.setUniform("u_keyVisualToggle", midiManager.midiInput["keyVisualToggle"]);
        this.shader.setUniform("u_oneColorToggle", midiManager.midiInput["oneColorToggle"]);

        p.rect(0, 0, p.width, p.height);
    }
}