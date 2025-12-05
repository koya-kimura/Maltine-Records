precision mediump float;

varying vec2 vTexCoord;

uniform float u_beat;
uniform float u_time;
uniform vec2 u_resolution;
uniform sampler2D u_tex;
uniform sampler2D u_uiTex;
uniform sampler2D u_captureTex;
uniform vec3 u_mainColor;
uniform vec3 u_subColor;
uniform int u_patternIndex;
uniform float u_faderValues[9];
uniform bool u_backShadowToggle;
uniform bool u_vibeToggle;
uniform bool u_stroboMomentary;

float PI = 3.14159265358979;

// ========================================
// ユーティリティ関数
// ========================================

// フェーダー値取得（配列インデックスアクセス）
float getFaderValue(int index) {
    if(index == 0) {
        return u_faderValues[0];
    } else if(index == 1) {
        return u_faderValues[1];
    } else if(index == 2) {
        return u_faderValues[2];
    } else if(index == 3) {
        return u_faderValues[3];
    } else if(index == 4) {
        return u_faderValues[4];
    } else if(index == 5) {
        return u_faderValues[5];
    } else if(index == 6) {
        return u_faderValues[6];
    } else if(index == 7) {
        return u_faderValues[7];
    } else if(index == 8) {
        return u_faderValues[8];
    }
    return 0.0;
}

// ========================================
// 数学・波形関数
// ========================================

// ジグザグ波（0〜1を繰り返す三角波）
float zigzag(float x) {
    return abs(mod(x, 2.0) - 1.0);
}

// 疑似乱数生成
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// 2D回転行列
mat2 rot(float angle) {
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

// 全象限対応のatan2
float atan2(float y, float x) {
    return x == 0. ? sign(y) * PI / 2. : atan(y, x);
}

// 値のリマップ
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

// ========================================
// イージング関数
// ========================================

// Sine イージング
float easeSineIn(float t) {
    return 1.0 - cos((t * PI) / 2.0);
}

float easeSineOut(float t) {
    return sin((t * PI) / 2.0);
}

float easeSineInOut(float t) {
    return -(cos(PI * t) - 1.0) / 2.0;
}

// Quad イージング
float easeQuadIn(float t) {
    return t * t;
}

float easeQuadOut(float t) {
    return 1.0 - (1.0 - t) * (1.0 - t);
}

float easeQuadInOut(float t) {
    return t < 0.5 ? 2.0 * t * t : 1.0 - pow(-2.0 * t + 2.0, 2.0) / 2.0;
}

// ========================================
// GVM関数（時間ベース補間）
// ========================================

// leapRamp: ループ周期内で滑らかに遷移する補間係数を返す
// x: 現在の時間（beatやtimeなど）
// loop: ループの周期
// move: 遷移にかける時間
// 戻り値: 現在のカウント + 遷移進行度（0.0, 1.0, 2.0, 2.5, 3.0... のように増加）
// 使用例: floor(leapRamp(beat, 4.0, 1.0)) で4拍ごとに切り替わるインデックス
//         fract(leapRamp(beat, 4.0, 1.0)) で遷移中の進行度（0〜1）
float leapRamp(float x, float loop, float move) {
    float count = floor(x / loop);
    float t = clamp((mod(x, loop) - (loop - move)) / move, 0.0, 1.0);
    return count + t;
}

// leapRampEase: イージング付きleapRamp（smoothstep使用）
float leapRampEase(float x, float loop, float move) {
    float count = floor(x / loop);
    float t = clamp((mod(x, loop) - (loop - move)) / move, 0.0, 1.0);
    t = easeSineInOut(t);
    return count + t;
}

// ========================================
// 座標変換関数
// ========================================

// 直交座標 → 極座標
vec2 xy2pol(vec2 xy) {
    return vec2(atan2(xy.y, xy.x), length(xy));
}

// 極座標 → 直交座標
vec2 pol2xy(vec2 pol) {
    return pol.y * vec2(cos(pol.x), sin(pol.x));
}

// 中心基準スケール
vec2 scale(vec2 uv, float scaleFactor) {
    vec2 centeredUV = uv - 0.5;
    centeredUV /= scaleFactor;
    return centeredUV + 0.5;
}

// モザイク（ピクセル化）
vec2 mosaic(vec2 uv, vec2 res, float n) {
    return vec2((floor(uv.x * n) + 0.5) / n, (floor(uv.y * n * res.y / res.x) + 0.5) / (n * res.y / res.x));
}

// タイル（UV繰り返し）
vec2 tile(vec2 uv, float n) {
    return fract(uv * n);
}

// ========================================
// 色変換関数
// ========================================

// グレースケール変換
float gray(vec3 col) {
    return dot(col, vec3(0.299, 0.587, 0.114));
}

// HSV → RGB（彩度・明度固定版）
vec3 hsv2rgb(in float h) {
    float s = 1.;
    float v = 1.;

    vec4 K = vec4(1., 2. / 3., 1. / 3., 3.);
    vec3 p = abs(fract(vec3(h) + K.xyz) * 6. - K.w);
    vec3 rgb = v * mix(vec3(K.x), clamp(p - K.x, 0., 1.), s);

    return rgb;
}

// RGB → HSV
vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

// HSV → RGB（完全版）
vec3 hsv2rgbFull(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// RGB色相回転（角度はラジアン、devideで量子化）
vec3 rgbRotate(vec3 rgb, float angle, float devide) {
    vec3 hsv = rgb2hsv(rgb);
    hsv.x = fract(hsv.x + angle / (2.0 * PI)); // 角度を0-1の範囲に正規化
    hsv.x = floor(hsv.x * devide) / devide; // 色相を指定した分割数で量子化
    hsv.y = 1.0; // 彩度を最大に
    return hsv2rgbFull(hsv);
}

// ========================================
// テクスチャサンプリング関数
// ========================================

// 範囲外を透明にするテクスチャサンプリング
vec4 sampleTextureSafe(sampler2D tex, vec2 uv) {
    if(uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
        return vec4(0.0);
    }
    return texture2D(tex, uv);
}

// 範囲外を透明にするテクスチャサンプリング（別名）
vec4 safeTexture2D(sampler2D tex, vec2 uv) {
    if(uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
        return vec4(0.0);
    }
    return texture2D(tex, uv);
}

// ========================================
// 背景パターン関数
// ========================================

// パターン0: ノイズテクスチャ - 紙のような柔らかいノイズ
vec3 noiseTexturePattern(vec2 uv, float beat, float time) {
    // 複数スケールのノイズを重ねて紙のような質感を作る
    float noise = 0.0;

    // 大きなムラ
    noise += random(floor(uv * 8.0 + vec2(random(vec2(floor(beat * 0.25))) * 7419.4174, 0.0))) * 0.3;

    // 中くらいのムラ
    noise += random(floor(uv * 20.0  + vec2(random(vec2(floor(beat * 0.5))) * 75092.4174, 0.0))) * 0.25;

    // 細かいムラ
    noise += random(floor(uv * 50.0 + vec2(random(vec2(floor(beat * 1.0))) * 34790.4174, 0.0))) * 0.2;
    // さらに細かいムラ
    noise += random(floor(uv * 100.0 + vec2(random(vec2(floor(beat * 2.0))) * 9472.4174, 0.0))) * 0.15;

    // 微細なムラ
    noise += random(floor(uv * 200.0 + vec2(random(vec2(floor(beat * 4.0))) * 1472.4174, 0.0))) * 0.1;

    // ノイズを0.0〜1.0の範囲に正規化
    noise = noise / 1.0;

    // 柔らかいグラデーションで2色をブレンド
    // 紙のような自然なムラ感を出すためにsmoothstepを使用
    float blend = smoothstep(0.3, 0.7, noise);

    return mix(u_subColor, u_mainColor, blend);
}

// パターン1: 斜め斜線 - ランダム角度で回転する斜線パターン
vec3 stripePattern(vec2 uv, float beat, float time) {
    // 45度回転したUV座標
    float angle = PI / 4.0 * floor(random(vec2(floor(beat * 0.25))) * 16.0);
    vec2 rotatedUV = uv * rot(angle);

    // 線の数（約10本）
    float lineCount = floor(map(random(vec2(floor(beat * 0.125))), 0.0, 1.0, 8.0, 20.0));

    // beatに基づいて線を移動（よりゆっくり）
    float movement = beat * 0.05;

    // 斜線パターン（Y座標ベース）
    float pattern = mod(floor((rotatedUV.y + movement) * lineCount), 2.0);

    // mainColorとsubColorを交互に
    return mix(u_subColor, u_mainColor, pattern);
}

// パターン2: グリッド線 - 縦横の線が交差するグリッド
vec3 gridLinePattern(vec2 uv, float beat, float time) {
    // グリッドの数
    float gridCountX = 16.0;
    float gridCountY = 9.0;

    // 線の太さ
    float lineWidth = 0.02;

    // UV座標をグリッドに分割
    vec2 gridUV = vec2(fract(uv.x * gridCountX), fract(uv.y * gridCountY));
    gridUV.x += sin(beat + uv.y * PI * 4.0) * map(pow(zigzag(beat * 0.0675), 3.0), 0.0, 1.0, 0.0, 0.45);

    // 縦線と横線を描画
    float verticalLine = smoothstep(lineWidth, lineWidth - 0.02, abs(gridUV.x - 0.5));
    float horizontalLine = smoothstep(lineWidth, lineWidth - 0.02, abs(gridUV.y - 0.5));

    // 縦線または横線があればメインカラー
    float pattern = max(verticalLine, horizontalLine);

    return mix(u_subColor, u_mainColor, pattern);
}

// パターン3: サンバースト - 中心から放射状に広がる線
vec3 sunburstPattern(vec2 uv, float beat, float time) {
    // 中心からの座標
    vec2 centeredUV = uv - 0.5;

    // 極座標に変換
    float angle = atan(centeredUV.y, centeredUV.x);

    // 放射線の数（太めにするために少なく）
    float rayCount = 12.0;

    // beatに基づいて回転
    float rotation = beat * 0.1 + leapRampEase(beat, 32.0, 4.0) * 0.5;

    // 放射状パターン
    float pattern = mod(floor((angle + rotation) / PI * rayCount), 2.0);

    return mix(u_subColor, u_mainColor, pattern);
}

// パターン4: サイケデリック波紋 - うねうねした同心円が広がるパターン
vec3 psychedelicSpiralPattern(vec2 uv, float beat, float time) {
    // 中心からの座標
    vec2 centeredUV = uv - 0.5;

    // アスペクト比補正（正円にする）
    vec2 aspect_correction = vec2(1.0);
    if(u_resolution.x > u_resolution.y) {
        aspect_correction.x = u_resolution.x / u_resolution.y;
    } else {
        aspect_correction.y = u_resolution.y / u_resolution.x;
    }
    centeredUV *= aspect_correction;

    // 極座標に変換
    float angle = atan(centeredUV.y, centeredUV.x) + leapRampEase(beat, 32.0, 8.0) * PI * 0.25; // 回転効果
    float radius = length(centeredUV);

    // 角度に応じて半径を波打たせる（うねうね効果）- 回転なし
    float waveFreq = 8.0;  // 波の数
    float waveAmp = 0.08;  // 波の振幅
    float wave = sin(angle * waveFreq) * waveAmp;

    // 波打った半径で同心円パターンを作成
    float ringCount = 12.0;  // 輪の数
    float distortedRadius = radius + wave;

    // 時間で円が外側に広がっていくアニメーション
    float expansion = time * 0.5;

    // 同心円パターン（2色交互）- 広がりアニメーション付き
    float pattern = mod(floor((distortedRadius - expansion) * ringCount), 2.0);

    return mix(u_subColor, u_mainColor, pattern);
}

// パターン5: チェッカーボード - beatで色が切り替わる市松模様
vec3 checkerboardPattern(vec2 uv, float beat, float time) {
    // グリッドの数（8x8のチェッカーボード）
    float scl = floor(pow(random(vec2(floor(beat * 0.125)) ), 2.0) * 3.0) + 1.0;;
    float gridCountX = 8.0 * scl;
    float gridCountY = 5.0 * scl;

    // UV座標をグリッドに分割（移動なし）
    float cellX = floor(uv.x * gridCountX);
    float cellY = floor(uv.y * gridCountY);

    // チェッカーボードパターン（XとYの合計が偶数か奇数かで色を決定）
    float basePattern = mod(cellX + cellY, 2.0);

    // beatが偶数か奇数かで色を反転
    float beatSwap = mod(floor(beat), 2.0);

    // beatに応じてパターンを反転
    float pattern = mod(basePattern + beatSwap, 2.0);

    return mix(u_subColor, u_mainColor, pattern);
}

// パターン6: 水玉模様 - サブカラー背景にメインカラーの円
vec3 polkaDotPattern(vec2 uv, float beat, float time) {
    // グリッドの数（8x8のチェッカーボード）
    float gridCountY = 6.0;
    float gridCountX = gridCountY * (u_resolution.x / u_resolution.y);

    uv.y += beat * 0.015;
    uv.y = fract(uv.y);

    if(mod(floor(uv.y * gridCountY), 2.0) == 1.0) {
        uv.x += 0.5 / gridCountX; // 奇数行は半分ずらす
    }
    uv.x += (mod(floor(uv.y * gridCountY), 2.0) == 1.0 ? -1.0: 1.0) * fract(leapRampEase(beat, 16.0, 2.0)) / gridCountX;

    // 水玉模様パターン（円の中心からの距離で決定）
    vec2 localUV = fract(uv * vec2(gridCountX, gridCountY));
    float dist = length(localUV - vec2(0.5, 0.5));

    // 円の半径
    float radius = map(zigzag(fract(leapRampEase(beat, 16.0, 2.0)) * 2.0), 0.0, 1.0, 0.2, 0.3) + sin(beat * PI * 0.5) * 0.01;

    // 円の内側ならメインカラー、外側ならサブカラー
    float pattern = step(dist, radius);

    return mix(u_subColor, u_mainColor, pattern);
}

// ========================================
// メイン処理
// ========================================

void main(void) {
    vec2 initialUV = vTexCoord;
    vec2 uv = vTexCoord;
    vec4 col = vec4(0.0, 0.0, 0.0, 1.0);

    // ----------------------------------------
    // 背景パターン選択
    // ----------------------------------------
    vec2 patternUV = uv;
    vec3 patternColor;

    // patternUV = mosaic(patternUV, u_resolution, 160.0); // モザイク化（オプション）

    if(u_patternIndex == 0) {
        patternColor = noiseTexturePattern(patternUV, u_beat, u_time);
    } else if(u_patternIndex == 1) {
        patternColor = stripePattern(patternUV, u_beat, u_time);
    } else if(u_patternIndex == 2) {
        patternColor = gridLinePattern(patternUV, u_beat, u_time);
    } else if(u_patternIndex == 3) {
        patternColor = sunburstPattern(patternUV, u_beat, u_time);
    } else if(u_patternIndex == 4) {
        patternColor = psychedelicSpiralPattern(patternUV, u_beat, u_time);
    } else if(u_patternIndex == 5) {
        patternColor = checkerboardPattern(patternUV, u_beat, u_time);
    } else if(u_patternIndex == 6) {
        patternColor = polkaDotPattern(patternUV, u_beat, u_time);
    } else {
        patternColor = noiseTexturePattern(patternUV, u_beat, u_time);
    }

    if(u_stroboMomentary) {
        patternColor = mix(vec3(1.0), patternColor, pow(zigzag(u_time * 48.0), 3.0));
    }

    // 背景パターンの適用（fader8で強度調整）
    col.rgb = patternColor * getFaderValue(8);

    // ----------------------------------------
    // メインテクスチャ処理
    // ----------------------------------------
    vec2 mainUV = initialUV;
    vec4 mainCol = vec4(0.0, 0.0, 0.0, 0.0);

    float colIndex = 0.0;

    // fader2: モザイク効果
    if(getFaderValue(2) == 1.0) {
        mainUV = mosaic(mainUV, u_resolution, 120.0);
    }

    // fader4: 横スクロール
    if(getFaderValue(4) == 1.0) {
        mainUV.x = fract(mainUV.x + u_time * 0.08);
    }

    // fader3: 4分割タイル
    if(getFaderValue(3) == 1.0) {
        colIndex = mainUV.x * 4.0;
        mainUV = tile(mainUV, 4.0);
    }

    // fader5: 3分割トリミング（中央のみ表示）
    if(getFaderValue(5) == 1.0) {
        float n = 3.0;
        colIndex *= 3.0;
        mainUV.x = fract(mainUV.x * n);
        mainUV.x = map(mainUV.x, 0.0, 1.0, floor(n * 0.5) / n, (floor(n * 0.5) + 1.0) / n);
    }

    // fader6: 縦スクロール（列ごとに反転）
    if(getFaderValue(6) == 1.0) {
        mainUV.y = fract(mainUV.y + u_time * 0.12 * (mod(floor(colIndex), 2.0) == 0.0 ? 1.0 : -1.0));
    }

    // ----------------------------------------
    // コラージュ効果サンプル
    // ----------------------------------------
    
    if(u_backShadowToggle) {
        for(float i = 0.0; i < 20.0; i++) {
            float sp =  1.0;
            vec2 uvOffset = mainUV;
            uvOffset = mosaic(uvOffset, u_resolution, 160.0);
            vec2 randomOffset = vec2(random(vec2(i * 12.34, 56.78 * floor(u_beat * sp))) - 0.5, random(vec2(i * 87.65, 43.21 * floor(u_beat * sp))) - 0.5) * 2.0;
            uvOffset += randomOffset;
            float scl = map(random(vec2(i * 98.76, 54.32 * floor(u_beat * sp))), 0.0, 1.0, 0.3, 1.0);
            uvOffset = scale(uvOffset, scl);
            vec4 offsetCol = safeTexture2D(u_tex, uvOffset);
            if(offsetCol.a > 0.0){
                mainCol = vec4(vec3(u_mainColor * easeQuadInOut(floor(gray(offsetCol.rgb)*4.0 + 0.5) / 4.0)), offsetCol.a);
            }
        }
    }
    
    if(u_vibeToggle) {
        mainUV -= vec2(0.5);
        mainUV *= rot(map(sin(u_beat * 64.0), -1.0, 1.0, -0.01, 0.01));
        mainUV += vec2(0.5);
        mainUV = scale(mainUV, 1.0 + map(sin(u_beat * 32.0), -1.0, 1.0, 0.0, 0.05));
    }

    if(texture2D(u_tex, mainUV).a > 0.0) {
        mainCol = texture2D(u_tex, mainUV);
    }

    // fader2: 階調制限（モザイクと組み合わせ）
    if(getFaderValue(2) == 1.0) {
        mainCol.rgb = floor(mainCol.rgb * 8.0 + 0.5) / 8.0; // 8階調に量子化
    }

    // コラージュ感を出すポスト処理（未実装）
    // if(abs(initialUV.y - 0.35) < 0.3 && mainCol.a > 0.0){
    //     mainCol.rgb = gray(mainCol.rgb) < 0.5 ? vec3(1.0, 1.0, 0.0) : vec3(0.0, 1.0, 0.0);
    // }

    // メインテクスチャの合成（fader7で強度調整）
    if(mainCol.a > 0.0) {
        col.rgb = mix(col.rgb, mainCol.rgb, getFaderValue(7));
    }

    // ----------------------------------------
    // 色相回転エフェクト
    // ----------------------------------------
    
    // fader0: 高速色相回転（滑らか）
    if(getFaderValue(0) == 1.0) {
        col.rgb = rgbRotate(col.rgb, u_time * 50.0, 360.0);
    }
    
    // fader1: 低速色相回転（8段階量子化）
    if(getFaderValue(1) == 1.0) {
        col.rgb = rgbRotate(col.rgb, u_time * 20.0, 8.0);
    }

    // ----------------------------------------
    // UI オーバーレイ
    // ----------------------------------------
    vec4 uiCol = texture2D(u_uiTex, initialUV);
    col.rgb = mix(col.rgb, uiCol.rgb, uiCol.a);

    gl_FragColor = col;
}