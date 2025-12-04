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

float PI = 3.14159265358979;

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

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

mat2 rot(float angle) {
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

float atan2(float y, float x) {
    return x == 0. ? sign(y) * PI / 2. : atan(y, x);
}

vec2 xy2pol(vec2 xy) {
    return vec2(atan2(xy.y, xy.x), length(xy));
}

vec2 pol2xy(vec2 pol) {
    return pol.y * vec2(cos(pol.x), sin(pol.x));
}

vec2 scale(vec2 uv, float scaleFactor) {
    vec2 centeredUV = uv - 0.5;
    centeredUV /= scaleFactor;
    return centeredUV + 0.5;
}

vec2 mosaic(vec2 uv, vec2 res, float n) {
    return vec2((floor(uv.x * n) + 0.5) / n, (floor(uv.y * n * res.y / res.x) + 0.5) / (n * res.y / res.x));
}

vec2 tile(vec2 uv, float n) {
    return fract(uv * n);
}

float gray(vec3 col) {
    return dot(col, vec3(0.299, 0.587, 0.114));
}

vec3 hsv2rgb(in float h) {
    float s = 1.;
    float v = 1.;

    vec4 K = vec4(1., 2. / 3., 1. / 3., 3.);
    vec3 p = abs(fract(vec3(h) + K.xyz) * 6. - K.w);
    vec3 rgb = v * mix(vec3(K.x), clamp(p - K.x, 0., 1.), s);

    return rgb;
}

// RGB to HSV変換
vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

// HSV to RGB変換（完全版）
vec3 hsv2rgbFull(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// RGB色相回転（角度はラジアン）
vec3 rgbRotate(vec3 rgb, float angle, float devide) {
    vec3 hsv = rgb2hsv(rgb);
    hsv.x = fract(hsv.x + angle / (2.0 * PI)); // 角度を0-1の範囲に正規化
    hsv.x = floor(hsv.x * devide) / devide; // 色相を指定した分割数で量子化
    hsv.y = 1.0; // 彩度を最大に
    return hsv2rgbFull(hsv);
}

float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

float zigzag(float x) {
    return abs(mod(x, 2.) - 1.0);
}

vec4 sampleTextureSafe(sampler2D tex, vec2 uv) {
    if(uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
        return vec4(0.0);
    }
    return texture2D(tex, uv);
}

// パターン0: 紙テクスチャ（0キー）- 紙のような柔らかいノイズテクスチャ
vec3 noiseTexturePattern(vec2 uv, float beat, float time) {
    // 複数スケールのノイズを重ねて紙のような質感を作る
    float noise = 0.0;

    // 大きなムラ
    noise += random(floor(uv * 8.0)) * 0.3;

    // 中くらいのムラ
    noise += random(floor(uv * 20.0)) * 0.25;

    // 細かいムラ
    noise += random(floor(uv * 50.0)) * 0.2;

    // さらに細かいムラ
    noise += random(floor(uv * 100.0)) * 0.15;

    // 微細なムラ
    noise += random(floor(uv * 200.0)) * 0.1;

    // ノイズを0.0〜1.0の範囲に正規化
    noise = noise / 1.0;

    // 柔らかいグラデーションで2色をブレンド
    // 紙のような自然なムラ感を出すためにsmoothstepを使用
    float blend = smoothstep(0.3, 0.7, noise);

    return mix(u_subColor, u_mainColor, blend);
}

// パターン1: 斜め斜線（1キー）
vec3 stripePattern(vec2 uv, float beat, float time) {
    // 45度回転したUV座標
    vec2 rotatedUV = uv * rot(PI / 4.0);

    // 線の数（約10本）
    float lineCount = 10.0;

    // beatに基づいて線を移動（よりゆっくり）
    float movement = beat * 0.05;

    // 斜線パターン（Y座標ベース）
    float pattern = mod(floor((rotatedUV.y + movement) * lineCount), 2.0);

    // mainColorとsubColorを交互に
    return mix(u_subColor, u_mainColor, pattern);
}

// パターン2: 垂直線（2キー）- 太さ1.5倍
vec3 dotPattern(vec2 uv, vec2 resolution, float beat, float time) {
    // 線の数（太さ1.5倍 = 数を減らす: 10 / 1.5 ≈ 6.67）
    float lineCount = 6.67;

    // beatに基づいて線を移動
    float movement = beat * 0.05;

    // 垂直線パターン（X座標ベース）
    float pattern = mod(floor((uv.x + movement) * lineCount), 2.0);

    return mix(u_subColor, u_mainColor, pattern);
}

// パターン3: 横線（3キー）- 太さ0.3倍
vec3 circlePattern(vec2 uv, float beat, float time) {
    // 線の数（太さ0.3倍 = 数を増やす: 10 / 0.3 ≈ 33.33）
    float lineCount = 33.33;

    // beatに基づいて線を移動
    float movement = beat * 0.05;

    // 横線パターン（Y座標ベース）
    float pattern = mod(floor((uv.y + movement) * lineCount), 2.0);

    return mix(u_subColor, u_mainColor, pattern);
}

// パターン4: 波打つ垂直線（4キー）- その場で波打つ
vec3 gridPattern(vec2 uv, float beat, float time) {
    // 線の数（太さ0.7倍 = 数を増やす: 10 / 0.7 ≈ 14.29）
    float lineCount = 14.29;

    // 横方向に大きく波打つ（sinで変形）- 移動なし、その場で波打つ
    float wave = sin(uv.y * PI * 4.0 + time * 2.0) * 0.3;

    // 波打つ垂直線パターン（移動なし）
    float pattern = mod(floor((uv.x + wave) * lineCount), 2.0);

    return mix(u_subColor, u_mainColor, pattern);
}

// パターン5: チェッカーボード（5キー）- beatで色が切り替わる
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

// パターン6: 水玉模様（6キー）- サブカラー背景にメインカラーの円（行ごとに半分ずらし）
vec3 polkaDotPattern(vec2 uv, float beat, float time) {
    // グリッドの数（8x8のチェッカーボード）
    float gridCountX = 8.0;
    float gridCountY = 5.0;

    // 水玉模様パターン（円の中心からの距離で決定）
    vec2 localUV = fract(uv * vec2(gridCountX, gridCountY));
    float dist = length(localUV - vec2(0.5, 0.5));

    // 円の半径
    float radius = 0.3;

    // 円の内側ならメインカラー、外側ならサブカラー
    float pattern = step(dist, radius);

    return mix(u_subColor, u_mainColor, pattern);
}

// パターン7: サンバースト（7キー）- 中心から放射状に広がる太い線
vec3 sunburstPattern(vec2 uv, float beat, float time) {
    // 中心からの座標
    vec2 centeredUV = uv - 0.5;

    // 極座標に変換
    float angle = atan(centeredUV.y, centeredUV.x);

    // 放射線の数（太めにするために少なく）
    float rayCount = 12.0;

    // beatに基づいて回転
    float rotation = beat * 0.1;

    // 放射状パターン
    float pattern = mod(floor((angle + rotation) / PI * rayCount), 2.0);

    return mix(u_subColor, u_mainColor, pattern);
}

// パターン8: グリッド線（8キー）- 縦横の線が交差するグリッド
vec3 gridLinePattern(vec2 uv, float beat, float time) {
    // グリッドの数
    float gridCountX = 16.0;
    float gridCountY = 9.0;

    // 線の太さ
    float lineWidth = 0.02;

    // UV座標をグリッドに分割
    vec2 gridUV = vec2(fract(uv.x * gridCountX), fract(uv.y * gridCountY));

    // 縦線と横線を描画
    float verticalLine = smoothstep(lineWidth, lineWidth - 0.02, abs(gridUV.x - 0.5));
    float horizontalLine = smoothstep(lineWidth, lineWidth - 0.02, abs(gridUV.y - 0.5));

    // 縦線または横線があればメインカラー
    float pattern = max(verticalLine, horizontalLine);

    return mix(u_subColor, u_mainColor, pattern);
}

// パターン9: サイケデリック波紋（9キー）- うねうねした同心円が広がるパターン
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
    float angle = atan(centeredUV.y, centeredUV.x);
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

vec4 safeTexture2D(sampler2D tex, vec2 uv) {
    if(uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
        return vec4(0.0);
    }
    return texture2D(tex, uv);
}

void main(void) {
    vec2 initialUV = vTexCoord;
    vec2 uv = vTexCoord;
    vec4 col = vec4(0.0, 0.0, 0.0, 1.0);

    // 模様を選択
    vec2 patternUV = uv;
    vec3 patternColor;

    // patternUV = mosaic(patternUV, u_resolution, 160.0);

    if(u_patternIndex == 0) {
        patternColor = noiseTexturePattern(patternUV, u_beat, u_time);
    } else if(u_patternIndex == 1) {
        patternColor = stripePattern(patternUV, u_beat, u_time);
    } else if(u_patternIndex == 2) {
        patternColor = gridLinePattern(patternUV, u_beat, u_time);
    } else if(u_patternIndex == 3) {
        patternColor = circlePattern(patternUV, u_beat, u_time);
    } else if(u_patternIndex == 4) {
        patternColor = psychedelicSpiralPattern(patternUV, u_beat, u_time);
    } else if(u_patternIndex == 5) {
        patternColor = checkerboardPattern(patternUV, u_beat, u_time);
    } else if(u_patternIndex == 6) {
        patternColor = polkaDotPattern(patternUV, u_beat, u_time);
    } else {
        patternColor = noiseTexturePattern(patternUV, u_beat, u_time);
    }

    // patternColor.rgb = floor(patternColor.rgb * 8.0 + 0.5) / 8.0; // 8階調に量子化

    col.rgb = patternColor * getFaderValue(8);

    // ============

    vec2 mainUV = initialUV;
    vec4 mainCol = vec4(0.0, 0.0, 0.0, 1.0);

    float colIndex = 0.0;

    if(getFaderValue(2) == 1.0) {
        mainUV = mosaic(mainUV, u_resolution, 120.0);
    }

    if(getFaderValue(4) == 1.0) {
        mainUV.x = fract(mainUV.x + u_time * 0.08);
    }

    if(getFaderValue(3) == 1.0) {
        colIndex = mainUV.x * 4.0;
        mainUV = tile(mainUV, 4.0);
    }

    if(getFaderValue(5) == 1.0) {
        float n = 3.0;
        colIndex *= 3.0;
        mainUV.x = fract(mainUV.x * n);
        mainUV.x = map(mainUV.x, 0.0, 1.0, floor(n * 0.5) / n, (floor(n * 0.5) + 1.0) / n);
    }

    if(getFaderValue(6) == 1.0) {
        mainUV.y = fract(mainUV.y + u_time * 0.12 * (mod(floor(colIndex), 2.0) == 0.0 ? 1.0 : -1.0));
    }

    // ゴリラ
    // for(float i = 0.0; i < 3.0; i++) {
    //     vec2 uvOffset = uv - vec2(0.5 - i*0.3, 0.0);
    //     vec4 offsetCol = safeTexture2D(u_tex, uvOffset);

    //     if(offsetCol.a > 0.0){
    //         mainCol.rgb = offsetCol.rgb;
    //     }
    // }

    // メガホン
    // for(float i = 0.0; i < 2.0; i++) {
    //     vec2 uvOffset = floor(i) == 0.0 ? uv : vec2(1.0-uv.x, uv.y);
    //     if(floor(i) == 1.0) {
    //         uvOffset *= rot(0.1);
    //         uvOffset.x += 0.2;
    //         uvOffset = scale(uvOffset, 1.3);
    //     }

    //     vec4 offsetCol = safeTexture2D(u_tex, uvOffset);

    //     if(offsetCol.a > 0.0){
    //         mainCol.rgb = offsetCol.rgb;
    //     }
    // }

    mainCol = texture2D(u_tex, mainUV);

    if(getFaderValue(2) == 1.0) {
        mainCol.rgb = floor(mainCol.rgb * 8.0 + 0.5) / 8.0; // 8階調に量子化
    }

    // TODO:この辺のポスト処理でコラージュ感出したい
    // if(abs(initialUV.y - 0.35) < 0.3 && mainCol.a > 0.0){
    //     mainCol.rgb = gray(mainCol.rgb) < 0.5 ? vec3(1.0, 1.0, 0.0) : vec3(0.0, 1.0, 0.0);
    // }   

    if(mainCol.a > 0.0) {
        col.rgb = mix(col.rgb, mainCol.rgb, getFaderValue(7));
    }

    if(getFaderValue(0) == 1.0) {
        col.rgb = rgbRotate(col.rgb, u_time * 50.0, 360.0);
    }
    if(getFaderValue(1) == 1.0) {
        col.rgb = rgbRotate(col.rgb, u_time * 20.0, 8.0);
    }

    vec4 uiCol = texture2D(u_uiTex, initialUV);
    col.rgb = mix(col.rgb, uiCol.rgb, uiCol.a);

    gl_FragColor = col;
}