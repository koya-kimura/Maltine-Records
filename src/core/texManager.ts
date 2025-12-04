import p5 from "p5";

import { Pattern } from "../scenes/background/patern";
import { ImageLayer } from "../scenes/image/ImageLayer";
import { OverLayer } from "../scenes/overlay/OverLayer";
import { ImageOverlay } from "../scenes/overlay/ImageOverlay";

// TexManager は描画用の p5.Graphics とシーン、MIDI デバッグ描画のハブを担当する。
export class TexManager {
    private renderTexture: p5.Graphics | null;
    private backgroundPattern: Pattern;
    private imageLayer: ImageLayer;
    private overLayer: OverLayer;
    private imageOverlay: ImageOverlay;
    private sceneIndex: number = 1;

    /**
     * TexManagerクラスのコンストラクタです。
     * ここでは、描画に使用するテクスチャの初期化（null設定）と、
     * リズム管理を行うBPMManager、バンド描画を行うBandManager、
     * そしてMIDIコントローラー（APC Mini MK2）との連携を行うAPCMiniMK2Managerの
     * インスタンス生成を行います。
     * これにより、アプリケーション全体の描画と制御の基盤を構築します。
     * 各マネージャーはそれぞれの責務（リズム、描画、入力制御）を独立して担います。
     */
    constructor() {
        this.renderTexture = null;
        this.backgroundPattern = new Pattern();
        this.imageLayer = new ImageLayer();
        this.overLayer = new OverLayer();
        this.imageOverlay = new ImageOverlay();
    }

    /**
     * アプリケーションの初期化処理を行います。
     * p5.jsのインスタンスを受け取り、画面サイズに合わせた描画用Graphics（オフスクリーンキャンバス）を作成します。
     * また、APCMiniMK2Managerに対して、各シーン（行）ごとのパラメータの最大値を設定します。
     * これにより、MIDIコントローラーの各フェーダーやボタンが制御できる値の範囲を定義し、
     * シーンごとの挙動（バンドの数、色、動きなど）をカスタマイズ可能にします。
     * 特定のシーンインデックスに対して、配列形式で最大値を指定しています。
     *
     * @param p p5.jsのインスタンス。createGraphicsなどの描画機能を使用するために必要です。
     * @param midiManager MIDIマネージャーインスタンス
     */
    async load(p: p5): Promise<void> {
        this.renderTexture = p.createGraphics(p.width, p.height);

        // Patternシェーダーの読み込み
        // TODO:キモいのでパス直す
        await this.backgroundPattern.load(p, "/shader/main.vert", "/shader/pattern.frag");
        await this.imageLayer.load(p);
        this.overLayer.load(p);
    }

    /**
     * 現在の描画用テクスチャ（Graphicsオブジェクト）を取得します。
     * このテクスチャは、メインの描画ループで生成されたコンテンツを保持しており、
     * ポストエフェクトの適用や最終的なキャンバスへの描画に使用されます。
     * もしテクスチャが初期化されていない場合（initが呼ばれる前など）は、
     * エラーをスローして開発者に通知します。
     * これにより、未初期化状態での不正なアクセスを防ぎます。
     *
     * @returns 描画内容を含むp5.Graphicsオブジェクト。
     * @throws Error テクスチャが初期化されていない場合。
     */
    getTexture(): p5.Graphics {
        const texture = this.renderTexture;
        if (!texture) {
            throw new Error("Texture not initialized");
        }
        return texture;
    }

    /**
     * ウィンドウサイズが変更された際に呼び出され、描画用テクスチャのサイズを更新します。
     * p5.jsのresizeCanvasメソッドを使用して、内部のGraphicsオブジェクトのサイズを
     * 新しいウィンドウの幅と高さに合わせます。
     * これにより、レスポンシブな描画が可能になり、ウィンドウサイズが変わっても
     * 描画内容が適切にスケーリングまたは再配置される準備を整えます。
     * テクスチャが未初期化の場合はエラーをスローします。
     *
     * @param p p5.jsのインスタンス。現在のウィンドウサイズ情報を含みます。
     */
    resize(p: p5): void {
        const texture = this.renderTexture;
        if (!texture) {
            throw new Error("Texture not initialized");
        }
        texture.resizeCanvas(p.width, p.height);
        this.backgroundPattern.resize(p);
        this.imageLayer.resize(p);
        this.overLayer.resize(p);
    }

    /**
     * 毎フレーム呼び出される更新処理です。
     * 主にリズム管理（BPMManager）とMIDI入力管理（APCMiniMK2Manager）の状態を更新します。
     * BPMManagerで現在の時間を進め、ビート情報を計算します。
     * その後、計算されたビート情報（整数部分）をAPCMiniMK2Managerに渡し、
     * MIDIコントローラーのLEDフィードバックや入力状態の同期を行います。
     * これにより、音楽的なタイミングとユーザー入力の同期を保ちます。
     *
     * @param _p p5.jsのインスタンス（現在は未使用ですが、将来的な拡張のために引数として保持）。
     */
    update(p: p5): void {
        this.backgroundPattern.update(p, 0);
    }

    /**
     * メインの描画処理を行います。
     * オフスクリーンキャンバス（renderTexture）に対して、背景のクリア、
     * 現在のビート情報の取得、MIDIコントローラーからのパラメータ取得を行います。
     * 取得したパラメータ（バンド設定、数値表示設定、カラーパレット）を用いて、
     * BandManagerを通じて実際のビジュアルを描画します。
     * 最後に、必要に応じてデバッグ情報の描画（コメントアウト中）も行える構造になっています。
     * push/popを使用することで、描画状態の汚染を防いでいます。
     *
     * @param p p5.jsのインスタンス。
     */
    draw(p: p5, beat: number): void {
        const texture = this.renderTexture;
        if (!texture) {
            throw new Error("Texture not initialized");
        }

        texture.push();
        texture.clear();

        // this.backgroundPattern.draw(texture, beat);
        this.imageLayer.draw(p, texture, this.sceneIndex, beat);
        this.overLayer.draw(p, texture, this.sceneIndex, beat);
        this.imageOverlay.draw(p, texture, this.imageLayer.getImageAnimation(), this.imageLayer.getImageGallery());
        texture.pop();
    }
}