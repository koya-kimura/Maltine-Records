/**
 * MIDI設定ファイル
 * APC Mini MK2のボタン・セルの設定を定義します。
 */

import type { ButtonConfig } from "./APCMiniMK2Manager";
import { LED_PALETTE } from "./ledPalette";

// ========================================
// ボタン設定
// ========================================

/**
 * グリッドボタンの設定
 * 必要に応じてページ・行・列を指定してボタンを登録してください。
 */
export const MIDI_BUTTON_CONFIGS: ButtonConfig[] = [
    // ========================================
    // サンプル: シーン選択（radioタイプ）
    // ========================================
    {
        key: "sceneSelect",
        type: "radio",
        cells: [
            { page: 0, row: 0, col: 0 },
            { page: 0, row: 1, col: 0 },
            { page: 0, row: 2, col: 0 },
            { page: 0, row: 3, col: 0 },
        ],
        activeColor: LED_PALETTE.RED,
        inactiveColor: LED_PALETTE.DIM,
        defaultValue: 0,
    },

    // ========================================
    // サンプル: エフェクトトグル（toggleタイプ）
    // ========================================
    // {
    //     key: "effectEnabled",
    //     type: "toggle",
    //     cells: [{ page: 0, row: 0, col: 1 }],
    //     activeColor: LED_PALETTE.GREEN,
    //     inactiveColor: LED_PALETTE.DIM,
    //     defaultValue: false,
    // },

    // ========================================
    // サンプル: ワンショットトリガー（oneshotタイプ）
    // ========================================
    // {
    //     key: "trigger",
    //     type: "oneshot",
    //     cells: [{ page: 0, row: 0, col: 2 }],
    //     activeColor: LED_PALETTE.ORANGE,
    //     inactiveColor: LED_PALETTE.DIM,
    // },

    // ========================================
    // サンプル: 押している間だけ（momentaryタイプ）
    // ========================================
    // {
    //     key: "flash",
    //     type: "momentary",
    //     cells: [{ page: 0, row: 0, col: 3 }],
    //     activeColor: LED_PALETTE.CYAN,
    //     inactiveColor: LED_PALETTE.DIM,
    // },
];

// ========================================
// フェーダーボタンモード設定
// ========================================

/**
 * フェーダーボタンのモード
 * - "mute": フェーダーボタンON時、フェーダー値を0にミュート
 * - "random": フェーダーボタンON時、フェーダー値をBPM同期でランダムに0/1切り替え
 */
export const FADER_BUTTON_MODE: "mute" | "random" = "mute";
