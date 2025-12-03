// SceneComposition はシーン全体の構成（画像+オーバーレイ）を管理するクラス。
// モード名のみを管理し、各コンポーネントにモード名を渡して描画させる。
import p5 from "p5";
import { ImageRenderer } from "./image/ImageRenderer";
import { Pattern } from "./overlay/patern";
import { P5Overlay } from "./overlay/P5Overlay";

/**
 * SceneCompositionクラス
 * モード名を管理し、各コンポーネントにモード名を渡して描画を委譲する
 */
export class SceneComposition {
    private imageRenderer: ImageRenderer;
    private pattern: Pattern;
    private p5Overlay: P5Overlay;

    private currentModeName: string;
    private modeNames: string[];

    /**
     * コンストラクタ
     */
    constructor(
        imageRenderer: ImageRenderer,
        pattern: Pattern,
        p5Overlay: P5Overlay
    ) {
        this.imageRenderer = imageRenderer;
        this.pattern = pattern;
        this.p5Overlay = p5Overlay;

        // モード名の配列
        this.modeNames = [
            "hand_1",
            "hand_2",
            "hand_3",
            "hand_4",
            "hand_5",
            "animal",
            "human",
            "life",
            "noface"
        ];

        this.currentModeName = this.modeNames[0];
    }

    /**
     * モードを設定
     */
    setMode(modeName: string): void {
        if (this.modeNames.includes(modeName)) {
            this.currentModeName = modeName;
        }
    }

    /**
     * インデックスでモードを設定
     */
    setModeByIndex(index: number): void {
        if (index >= 0 && index < this.modeNames.length) {
            this.currentModeName = this.modeNames[index];
        }
    }

    /**
     * 現在のモード名を取得
     */
    getCurrentModeName(): string {
        return this.currentModeName;
    }

    /**
     * 現在のモードのインデックスを取得
     */
    getCurrentModeIndex(): number {
        return this.modeNames.indexOf(this.currentModeName);
    }

    /**
     * 全モード名を取得
     */
    getModeNames(): string[] {
        return [...this.modeNames];
    }

    /**
     * モード数を取得
     */
    getModeCount(): number {
        return this.modeNames.length;
    }

    /**
     * シーンを更新
     */
    update(p: p5, beat: number = 0): void {
        // ImageRendererの更新（アニメーション進行）
        this.imageRenderer.update(p);

        // パターンの更新
        this.pattern.update(p, this.currentModeName, beat);
    }

    /**
     * シーンを描画
     */
    draw(
        p: p5 | p5.Graphics,
        centerX: number,
        centerY: number,
        baseWidth: number,
        baseHeight: number,
        beat: number = 0
    ): void {
        // 画像の描画（ImageRendererが画像取得〜エフェクト〜描画まで行う）
        this.imageRenderer.draw(
            p,
            this.currentModeName
        );

        // p5オーバーレイの描画
        this.p5Overlay.draw(p, this.currentModeName, centerX, centerY, baseWidth, baseHeight, beat);
    }

    // 各コンポーネントへのアクセサ

    getImageRenderer(): ImageRenderer {
        return this.imageRenderer;
    }

    getPattern(): Pattern {
        return this.pattern;
    }

    getP5Overlay(): P5Overlay {
        return this.p5Overlay;
    }
}
