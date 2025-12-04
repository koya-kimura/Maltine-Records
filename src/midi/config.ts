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
    {
        key: "colorSelect",
        type: "radio",
        cells: [
            { page: 0, row: 6, col: 4 },
            { page: 0, row: 6, col: 5 },
            { page: 0, row: 6, col: 6 },
            { page: 0, row: 6, col: 7 },
            { page: 0, row: 7, col: 4 },
            { page: 0, row: 7, col: 5 },
            { page: 0, row: 7, col: 6 },
        ],
        activeColor: LED_PALETTE.RED,
        inactiveColor: LED_PALETTE.DIM,
        defaultValue: 0,
    },

    {
        key: "colorSelectRandom",
        type: "random",
        cells: [{ page: 0, row: 7, col: 7 }],
        randomTarget: "colorSelect",  // 対象のradioボタンのkey
        excludeCurrent: true,         // 現在値を除外（デフォルト: true）
        speed: 1,                     // ランダム切り替えのスピード倍率（1=1beat毎、4=4倍速）
        activeColor: LED_PALETTE.GREEN,
        inactiveColor: LED_PALETTE.PURPLE,
    },

    {
        key: "sceneSelect",
        type: "radio",
        cells: [
            { page: 0, row: 0, col: 0 },
            { page: 0, row: 0, col: 1 },
            { page: 0, row: 0, col: 2 },
            { page: 0, row: 0, col: 3 },
            { page: 0, row: 0, col: 4 },
            { page: 0, row: 0, col: 5 },
            { page: 0, row: 0, col: 6 },
            { page: 0, row: 0, col: 7 },
            { page: 0, row: 1, col: 0 },
            { page: 0, row: 1, col: 1 },
            { page: 0, row: 1, col: 2 },
            { page: 0, row: 1, col: 3 },
            { page: 0, row: 1, col: 4 },
            { page: 0, row: 1, col: 5 },
            { page: 0, row: 1, col: 6 },
            { page: 0, row: 1, col: 7 },
            { page: 0, row: 2, col: 0 },
            { page: 0, row: 2, col: 1 },
            { page: 0, row: 2, col: 2 },
            { page: 0, row: 2, col: 3 },
            { page: 0, row: 2, col: 4 },
            { page: 0, row: 2, col: 5 },
            { page: 0, row: 2, col: 6 },
            { page: 0, row: 2, col: 7 },
            // { page: 0, row: 2, col: 0 },
            // { page: 0, row: 2, col: 1 },
            // { page: 0, row: 2, col: 2 },
            // { page: 0, row: 2, col: 3 },
            // { page: 0, row: 2, col: 4 },
            // { page: 0, row: 2, col: 5 },
            // { page: 0, row: 2, col: 6 },
        ],
        activeColor: LED_PALETTE.RED,
        inactiveColor: LED_PALETTE.DIM,
        defaultValue: 0,
    },

    {
        key: "sceneSelectRandom",
        type: "random",
        cells: [{ page: 0, row: 3, col: 7 }],
        randomTarget: "sceneSelect",  // 対象のradioボタンのkey
        excludeCurrent: true,         // 現在値を除外（デフォルト: true）
        speed: 1,                     // ランダム切り替えのスピード倍率（1=1beat毎、4=4倍速）
        activeColor: LED_PALETTE.GREEN,
        inactiveColor: LED_PALETTE.PURPLE,
    },

    {
        key: "patternSelect",
        type: "radio",
        cells: [
            { page: 0, row: 4, col: 4 },
            { page: 0, row: 4, col: 5 },
            { page: 0, row: 4, col: 6 },
            { page: 0, row: 4, col: 7 },
            { page: 0, row: 5, col: 4 },
            { page: 0, row: 5, col: 5 },
            { page: 0, row: 5, col: 6 },
        ],
        activeColor: LED_PALETTE.RED,
        inactiveColor: LED_PALETTE.DIM,
        defaultValue: 0,
    },

    {
        key: "patternSelectRandom",
        type: "random",
        cells: [{ page: 0, row: 5, col: 7 }],
        randomTarget: "patternSelect",  // 対象のradioボタンのkey
        excludeCurrent: true,         // 現在値を除外（デフォルト: true）
        speed: 1,                     // ランダム切り替えのスピード倍率（1=1beat毎、4=4倍速）
        activeColor: LED_PALETTE.GREEN,
        inactiveColor: LED_PALETTE.PURPLE,
    },

    {
        key: "uiSelect",
        type: "radio",
        cells: [
            { page: 0, row: 4, col: 0 },
            { page: 0, row: 4, col: 1 },
            { page: 0, row: 4, col: 2 },
            { page: 0, row: 4, col: 3 },
        ],
        activeColor: LED_PALETTE.RED,
        inactiveColor: LED_PALETTE.DIM,
        defaultValue: 0,
    },

    {
        key: "doubleSpeedToggle",
        type: "toggle",
        cells: [{ page: 0, row: 5, col: 0 }],
        activeColor: LED_PALETTE.GREEN,
        inactiveColor: LED_PALETTE.DIM,
        defaultValue: false,
    },

    {
        key: "quadSpeedMomentary",
        type: "momentary",
        cells: [{ page: 0, row: 5, col: 1 }],
        activeColor: LED_PALETTE.CYAN,
        inactiveColor: LED_PALETTE.DIM,
    },
];

// ========================================
// フェーダーボタンモード設定
// ========================================

/**
 * フェーダーボタンのモード
 * - "mute": フェーダーボタンON時、フェーダー値を0にミュート
 * - "random": フェーダーボタンON時、フェーダー値をBPM同期でランダムに0/1切り替え
 */
export const FADER_BUTTON_MODE: "mute" | "random" = "random";
