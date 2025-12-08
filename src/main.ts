// main.ts は p5 スケッチのエントリーポイントとして描画ループを構成する。
import p5 from "p5";

// p5.jsのフレンドリーエラーシステムを無効化（パフォーマンス向上＆不要なコンソールエラー抑制）
(p5 as unknown as { disableFriendlyErrors: boolean }).disableFriendlyErrors = true;

import { BPMManager } from "./rhythm/BPMManager";
import { TexManager } from "./core/texManager";
import { UIManager } from "./core/uiManager";
import { EffectManager } from "./core/effectManager";
import { APCMiniMK2Manager } from "./midi/APCMiniMK2Manager";
// グローバルMIDIマネージャー
const midiManager = new APCMiniMK2Manager();
const bpmManager = new BPMManager();

const texManager = new TexManager();
const uiManager = new UIManager();
const effectManager = new EffectManager();

let captureTexture: p5.Graphics;
let font: p5.Font;
let logo: p5.Image | undefined;
let keyVisual: p5.Image | undefined;

// sketch は p5 インスタンスモードで実行されるエントリー関数。
// sketch は p5 インスタンスモードで実行されるエントリー関数。
// p5.jsのライフサイクルメソッド（setup, drawなど）を定義し、
// アプリケーション全体の初期化と更新ループを管理します。
// ローディング画面の進捗更新用ヘルパー
const updateLoadingProgress = (progress: number) => {
  const progressBar = document.getElementById('progress-bar');
  if (progressBar) {
    progressBar.style.width = `${Math.min(100, progress)}%`;
  }
};

const hideLoadingScreen = () => {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.classList.add('hidden');
    // アニメーション完了後にDOMから削除
    setTimeout(() => {
      loadingScreen.remove();
    }, 500);
  }
};

const sketch = (p: p5) => {
  // setup は一度だけ呼ばれ、レンダーターゲットとシェーダーを初期化する。
  // キャンバスの作成、テクスチャ管理、UI管理、エフェクト管理の初期化、
  // および外部リソース（フォント、シェーダー）の非同期読み込みを行います。
  p.setup = async () => {
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    p.noCursor(); // カーソルを非表示にする
    // p.pixelDensity(3); // 高解像度ディスプレイ対応

    updateLoadingProgress(5);

    // 各マネージャーの初期化
    await texManager.load(p);
    updateLoadingProgress(70);
    
    await midiManager.init(); // MIDI設定をconfig.tsから読み込み
    updateLoadingProgress(75);
    
    uiManager.init(p);

    // カメラキャプチャ用のバッファ（現在未使用のため空のテクスチャ）
    captureTexture = p.createGraphics(p.windowWidth, p.windowHeight);
    updateLoadingProgress(80);

    // リソースの読み込み
    // localディレクトリの画像はオプション（なくてもエラーしない）
    // p5.jsのloadImageはPromise rejectではなくコールバックでエラーを返すため、Promise化して対応
    logo = await new Promise<p5.Image | undefined>((resolve) => {
      p.loadImage(
        "/local/logotype.png",
        (img) => resolve(img),
        () => {
          console.warn("Logo image not found at /local/logotype.png - skipping");
          resolve(undefined);
        }
      );
    });
    updateLoadingProgress(85);
    
    keyVisual = await new Promise<p5.Image | undefined>((resolve) => {
      p.loadImage(
        "/local/city.png",
        (img) => resolve(img),
        () => {
          console.warn("Key visual image not found at /local/keyVisual.png - skipping");
          resolve(undefined);
        }
      );
    });
    updateLoadingProgress(90);
    
    font = await p.loadFont("/font/Jost-Regular.ttf");
    updateLoadingProgress(95);
    
    await effectManager.load(
      p,
      "/shader/main.vert",
      "/shader/postProcess.frag",
    );
    updateLoadingProgress(100);
    
    // ロード完了、画面を非表示
    hideLoadingScreen();
  };

  // draw は毎フレームのループでシーン更新とポストエフェクトを適用する。
  // 1. カメラ入力の更新と描画
  // 2. テクスチャマネージャー（シーン描画）の更新
  // 3. UIマネージャー（オーバーレイ情報）の更新
  // 4. エフェクトマネージャーによるポストプロセスの適用（最終出力）
  p.draw = () => {
    p.clear();

    //=============

    if(midiManager.midiInput["quadSpeedMomentary"]){
        bpmManager.quadSpeed();
    }
    else if(midiManager.midiInput["doubleSpeedToggle"]){
        bpmManager.doubleSpeed();
    }
    bpmManager.update();
    midiManager.update(bpmManager.getBeat() * 2.0);

    // シーンの更新と描画
    texManager.update(p);
    texManager.draw(p, bpmManager.getBeat(), midiManager);

    // UIの更新と描画
    uiManager.update(p);
    uiManager.draw(p, midiManager,font, logo);

    // ポストエフェクトの適用と画面への描画
    effectManager.apply(p, texManager.getTexture(), uiManager.getTexture(), captureTexture, midiManager, bpmManager.getBeat(), keyVisual);
  };

  // windowResized はブラウザのリサイズに追従してバッファを更新する。
  // キャンバスサイズをウィンドウサイズに合わせ、
  // テクスチャマネージャーとUIマネージャーにもリサイズを通知します。
  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    texManager.resize(p);
    uiManager.resize(p);
  };

  // keyPressed はキー入力イベントを処理する。
  // スペースキーでフルスクリーンモードの切り替えを行い、
  // その他のキー入力はテクスチャマネージャー（シーン切り替えなど）に伝播させます。
  p.keyPressed = () => {
    if(p.keyCode === 13){
      bpmManager.tapTempo();
    }

    if (p.keyCode === 32) {
      p.fullscreen(true);
    }
  };
};

// p5.js スケッチを起動する。
new p5(sketch);