// SceneComposition はシーン全体の構成（画像+オーバーレイ）を管理するクラス。
import p5 from "p5";
import { ImageAnimation } from "./ImageAnimation";
import { ImageGallery } from "./ImageGallery";
import { ImageLayer } from "./ImageLayer";
import { Pattern } from "../pattern/patern";

/**
 * 画像ソースの種類
 */
export const ImageSourceType = {
    STATIC_IMAGE: "static" as const,      // 静止画（ImageGallery）
    ANIMATION: "animation" as const        // アニメーション（ImageAnimation）
} as const;
export type ImageSourceType = typeof ImageSourceType[keyof typeof ImageSourceType];

/**
 * オーバーレイの種類
 */
export const OverlayType = {
    NONE: "none" as const,                 // オーバーレイなし
    SHADER_PATTERN: "shader" as const,     // シェーダーパターン（Pattern）
    P5_OBJECT: "p5object" as const         // p5オブジェクト描画
} as const;
export type OverlayType = typeof OverlayType[keyof typeof OverlayType];

/**
 * シーン構成モード
 */
export interface CompositionMode {
    name: string;                  // モード名
    imageSource: ImageSourceType;  // 画像ソース
    imageCategory?: string;        // 静止画の場合のカテゴリ
    imageIndex?: number;           // 静止画の場合のインデックス
    animationIndex?: number;       // アニメーションの場合のセット番号
    overlayType: OverlayType;      // オーバーレイタイプ
    patternType?: number;          // シェーダーパターンの場合の種類
    maskType?: number;             // シェーダーパターンの場合のマスク
    overlaySize?: number;          // オーバーレイのサイズ（画面比）
    imageSize?: number;            // 画像のサイズ（画面比）
}

/**
 * SceneCompositionクラス
 * 画像ソースとオーバーレイの組み合わせを管理します。
 */
export class SceneComposition {
    private imageAnimation: ImageAnimation;
    private imageGallery: ImageGallery;
    private imageLayer: ImageLayer;
    private overlayPattern: Pattern;

    private currentMode: CompositionMode;
    private modes: Map<string, CompositionMode>;

    /**
     * コンストラクタ
     * 
     * @param imageAnimation handアニメーションインスタンス
     * @param imageGallery 静止画ギャラリーインスタンス
     * @param imageLayer 共通画像レイヤーインスタンス
     * @param overlayPattern オーバーレイ用パターンインスタンス
     */
    constructor(
        imageAnimation: ImageAnimation,
        imageGallery: ImageGallery,
        imageLayer: ImageLayer,
        overlayPattern: Pattern
    ) {
        this.imageAnimation = imageAnimation;
        this.imageGallery = imageGallery;
        this.imageLayer = imageLayer;
        this.overlayPattern = overlayPattern;

        this.modes = new Map();
        this.currentMode = this.createDefaultMode();

        // デフォルトモードを登録
        this.registerDefaultModes();
    }

    /**
     * デフォルトモードを作成
     */
    private createDefaultMode(): CompositionMode {
        return {
            name: "default",
            imageSource: ImageSourceType.ANIMATION,
            animationIndex: 0,
            overlayType: OverlayType.SHADER_PATTERN,
            patternType: 2,
            maskType: 1,
            overlaySize: 0.4,
            imageSize: 0.8
        };
    }

    /**
     * デフォルトのモードプリセットを登録
     */
    private registerDefaultModes(): void {
        // モード1: handアニメーション + 円パターン（四角マスク）
        this.registerMode({
            name: "hand_with_circle",
            imageSource: ImageSourceType.ANIMATION,
            animationIndex: 0,
            overlayType: OverlayType.P5_OBJECT,
            overlaySize: 0.4,
            imageSize: 0.8
        });

        // モード2: animal静止画 + グリッドパターン（円マスク）
        this.registerMode({
            name: "animal_with_grid",
            imageSource: ImageSourceType.STATIC_IMAGE,
            imageCategory: "animal",
            imageIndex: 0,
            overlayType: OverlayType.P5_OBJECT,
            overlaySize: 0.5,
            imageSize: 0.6
        });

        // モード3: human静止画 + オーバーレイなし
        this.registerMode({
            name: "human_simple",
            imageSource: ImageSourceType.STATIC_IMAGE,
            imageCategory: "human",
            imageIndex: 0,
            overlayType: OverlayType.P5_OBJECT,
            imageSize: 0.7
        });

        // モード4: handアニメーション + p5オブジェクト
        this.registerMode({
            name: "hand_with_p5",
            imageSource: ImageSourceType.ANIMATION,
            animationIndex: 1,
            overlayType: OverlayType.P5_OBJECT,
            overlaySize: 0.3,
            imageSize: 0.8
        });

        // デフォルトモードを設定
        this.setMode("hand_with_circle");
    }

    /**
     * モードを登録
     */
    registerMode(mode: CompositionMode): void {
        this.modes.set(mode.name, mode);
    }

    /**
     * モードを設定
     */
    setMode(modeName: string): void {
        const mode = this.modes.get(modeName);
        if (mode) {
            this.currentMode = mode;
            this.applyMode();
        }
    }

    /**
     * 現在のモードを適用
     */
    private applyMode(): void {
        // 画像ソースの設定
        if (this.currentMode.imageSource === ImageSourceType.STATIC_IMAGE) {
            if (this.currentMode.imageCategory) {
                this.imageGallery.setCategory(this.currentMode.imageCategory);
            }
            if (this.currentMode.imageIndex !== undefined) {
                this.imageGallery.setImageIndex(this.currentMode.imageIndex);
            }
        } else if (this.currentMode.imageSource === ImageSourceType.ANIMATION) {
            if (this.currentMode.animationIndex !== undefined) {
                this.imageAnimation.setAnimationIndex(this.currentMode.animationIndex);
            }
        }

        // オーバーレイの設定
        if (this.currentMode.overlayType === OverlayType.SHADER_PATTERN) {
            if (this.currentMode.patternType !== undefined) {
                this.overlayPattern.setPatternType(this.currentMode.patternType);
            }
            if (this.currentMode.maskType !== undefined) {
                this.overlayPattern.setMaskType(this.currentMode.maskType);
            }
        }
    }

    /**
     * 現在の画像を取得
     */
    getCurrentImage(): p5.Image | null {
        if (this.currentMode.imageSource === ImageSourceType.STATIC_IMAGE) {
            return this.imageGallery.getCurrentImage();
        } else if (this.currentMode.imageSource === ImageSourceType.ANIMATION) {
            return this.imageAnimation.getCurrentFrame();
        }
        return null;
    }

    /**
     * シーンを更新
     */
    update(p: p5): void {
        // アニメーションの場合、フレーム更新
        if (this.currentMode.imageSource === ImageSourceType.ANIMATION) {
            this.imageAnimation.update(p);
        }

        // 画像レイヤーの更新
        const currentImage = this.getCurrentImage();
        this.imageLayer.updateWithImage(p, currentImage);

        // オーバーレイの更新
        if (this.currentMode.overlayType === OverlayType.SHADER_PATTERN) {
            this.overlayPattern.update(p, 0); // beatは外部から渡すように後で修正可能
        }
    }

    /**
     * シーンを描画
     */
    draw(p: p5 | p5.Graphics, centerX: number, centerY: number, baseWidth: number, baseHeight: number): void {
        const imageSize = this.currentMode.imageSize || 0.8;
        const overlaySize = this.currentMode.overlaySize || 0.4;

        // 画像レイヤーの描画（親でimageModeがCENTERに設定されている前提）
        p.push();
        this.imageLayer.draw(p, centerX, centerY, baseWidth * imageSize, baseHeight * imageSize);
        p.pop();

        // オーバーレイの描画
        if (this.currentMode.overlayType === OverlayType.SHADER_PATTERN) {
            p.push();
            this.overlayPattern.drawPattern(p, centerX, centerY, baseWidth * overlaySize, baseHeight * overlaySize);
            p.pop();
        } else if (this.currentMode.overlayType === OverlayType.P5_OBJECT) {
            // p5オブジェクト描画（例：円を描画）
            this.drawP5Overlay(p, centerX, centerY, baseWidth * overlaySize, baseHeight * overlaySize);
        }
    }

    /**
     * p5オブジェクトによるオーバーレイ描画
     */
    private drawP5Overlay(p: p5 | p5.Graphics, x: number, y: number, w: number, h: number): void {
        p.push();
        p.translate(x, y);
        p.noFill();
        p.stroke(255);
        p.strokeWeight(3);
        p.circle(0, 0, Math.min(w, h) * 0.8);
        p.pop();
    }

    /**
     * 現在のモードを取得
     */
    getCurrentMode(): CompositionMode {
        return this.currentMode;
    }

    /**
     * 全モード名を取得
     */
    getModeNames(): string[] {
        return Array.from(this.modes.keys());
    }
}
