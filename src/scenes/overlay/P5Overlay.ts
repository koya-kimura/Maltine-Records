// P5Overlay はp5.jsで描画するオーバーレイクラス。
// モード名を受け取り、対応する図形やエフェクトを描画する。
import p5 from "p5";

/**
 * モードごとのオーバーレイ設定
 */
interface OverlayConfig {
    type: "circle" | "rect" | "triangle" | "none";
    size: number;           // サイズ（画面比）
    strokeWeight: number;   // 線の太さ
    fill: boolean;          // 塗りつぶすか
    animated: boolean;      // アニメーションするか
}

/**
 * P5Overlayクラス
 * モード名に応じてp5.jsでオーバーレイを描画する
 */
export class P5Overlay {
    private configs: Map<string, OverlayConfig>;

    constructor() {
        this.configs = new Map();
        this.registerDefaultConfigs();
    }

    /**
     * デフォルトの設定を登録
     */
    private registerDefaultConfigs(): void {
        // handアニメーション用
        this.configs.set("hand_1", { type: "circle", size: 0.8, strokeWeight: 3, fill: false, animated: false });
        this.configs.set("hand_2", { type: "circle", size: 0.8, strokeWeight: 3, fill: false, animated: false });
        this.configs.set("hand_3", { type: "circle", size: 0.8, strokeWeight: 3, fill: false, animated: false });
        this.configs.set("hand_4", { type: "circle", size: 0.8, strokeWeight: 3, fill: false, animated: false });
        this.configs.set("hand_5", { type: "circle", size: 0.8, strokeWeight: 3, fill: false, animated: false });

        // 静止画用
        this.configs.set("animal", { type: "rect", size: 0.9, strokeWeight: 3, fill: false, animated: false });
        this.configs.set("human", { type: "none", size: 0, strokeWeight: 0, fill: false, animated: false });
        this.configs.set("life", { type: "none", size: 0, strokeWeight: 0, fill: false, animated: false });
        this.configs.set("noface", { type: "triangle", size: 0.6, strokeWeight: 3, fill: false, animated: false });
    }

    /**
     * モード名に応じてオーバーレイを描画
     */
    draw(
        p: p5 | p5.Graphics,
        modeName: string,
        centerX: number,
        centerY: number,
        baseWidth: number,
        baseHeight: number,
        beat: number = 0
    ): void {
        const config = this.configs.get(modeName);
        if (!config || config.type === "none") return;

        const w = baseWidth * config.size;
        const h = baseHeight * config.size;

        p.push();
        p.translate(centerX, centerY);

        // 色設定
        if (config.fill) {
            p.fill(255);
            p.noStroke();
        } else {
            p.noFill();
            p.stroke(255);
            p.strokeWeight(config.strokeWeight);
        }

        // アニメーション
        if (config.animated) {
            const scale = 1 + Math.sin(beat * Math.PI) * 0.1;
            p.scale(scale);
        }

        // 図形描画
        switch (config.type) {
            case "circle":
                this.drawCircle(p, w, h);
                break;
            case "rect":
                this.drawRect(p, w, h);
                break;
            case "triangle":
                this.drawTriangle(p, w, h);
                break;
        }

        p.pop();
    }

    /**
     * 円を描画
     */
    private drawCircle(p: p5 | p5.Graphics, w: number, h: number): void {
        p.circle(0, 0, Math.min(w, h) * 0.8);
    }

    /**
     * 四角形を描画
     */
    private drawRect(p: p5 | p5.Graphics, w: number, h: number): void {
        p.rectMode(p.CENTER);
        p.rect(0, 0, w * 0.8, h * 0.8);
    }

    /**
     * 三角形を描画
     */
    private drawTriangle(p: p5 | p5.Graphics, w: number, h: number): void {
        const size = Math.min(w, h) * 0.4;
        p.triangle(0, -size, -size, size, size, size);
    }

    /**
     * 設定を取得
     */
    getConfig(modeName: string): OverlayConfig | undefined {
        return this.configs.get(modeName);
    }

    /**
     * 設定を更新
     */
    setConfig(modeName: string, config: OverlayConfig): void {
        this.configs.set(modeName, config);
    }
}
