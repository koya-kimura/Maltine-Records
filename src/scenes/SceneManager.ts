// SceneManager: シーン管理クラス
// ImageRendererとP5Overlayで共通のシーン定義を管理する

import p5 from "p5";
import type { ImageAnimation } from "./image/ImageAnimation";
import type { ImageGallery } from "./image/ImageGallery";

// カラーパレットの型定義
export interface ColorPalette {
    mainColor: string;
    subColor: string;
    accentColor: string;
}

// 共通コンテキスト
export interface BaseSceneContext {
    p: p5;
    tex: p5.Graphics;
    beat: number;
}

// ImageRenderer用コンテキスト
export interface ImageSceneContext extends BaseSceneContext {
    imageAnimation: ImageAnimation;
    imageGallery: ImageGallery;
}

// Overlay用コンテキスト
export interface OverlaySceneContext extends BaseSceneContext {
    colorPalette: ColorPalette;
}

// シーン定義
export interface SceneDefinition {
    id: string;                                      // "scene01_noface" など
    name: string;                                    // 表示名（デバッグ用）
    drawImage?: (ctx: ImageSceneContext) => void;    // 画像描画（なければスキップ）
    drawOverlay?: (ctx: OverlaySceneContext) => void; // オーバーレイ描画（なければスキップ）
}

// シーン管理クラス
class SceneManagerClass {
    private scenes: SceneDefinition[] = [];
    private sceneMap: Map<string, number> = new Map();

    /**
     * シーンを登録
     */
    register(scene: SceneDefinition): void {
        this.sceneMap.set(scene.id, this.scenes.length);
        this.scenes.push(scene);
    }

    /**
     * 複数シーンを一括登録
     */
    registerAll(scenes: SceneDefinition[]): void {
        scenes.forEach(scene => this.register(scene));
    }

    /**
     * インデックスでシーンを取得
     */
    getScene(index: number): SceneDefinition | undefined {
        return this.scenes[index];
    }

    /**
     * IDでシーンを取得
     */
    getSceneById(id: string): SceneDefinition | undefined {
        const index = this.sceneMap.get(id);
        return index !== undefined ? this.scenes[index] : undefined;
    }

    /**
     * IDでインデックスを取得
     */
    getIndexById(id: string): number {
        return this.sceneMap.get(id) ?? -1;
    }

    /**
     * シーン数を取得（プロパティ版）
     */
    get sceneCount(): number {
        return this.scenes.length;
    }

    /**
     * シーン数を取得（メソッド版）
     */
    getSceneCount(): number {
        return this.scenes.length;
    }

    /**
     * 全シーンのID一覧を取得
     */
    getAllSceneIds(): string[] {
        return this.scenes.map(s => s.id);
    }

    /**
     * 全シーンを取得
     */
    getAllScenes(): ReadonlyArray<SceneDefinition> {
        return this.scenes;
    }
}

// シングルトンインスタンス
export const sceneManager = new SceneManagerClass();
