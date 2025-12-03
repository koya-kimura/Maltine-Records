precision mediump float;

varying vec2 vTexCoord;

uniform float u_beat;
uniform float u_time;
uniform vec2 u_resolution;
uniform int u_patternIndex;
uniform vec3 u_mainColor;  // メインカラー
uniform vec3 u_subColor;   // サブカラー

float PI = 3.14159265358979;

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

vec2 mosaic(vec2 uv, vec2 res, float n) {
    return vec2((floor(uv.x * n) + 0.5) / n, (floor(uv.y * n * res.y / res.x) + 0.5) / (n * res.y / res.x));
}

float gray(vec3 col) {
    return dot(col, vec3(0.299, 0.587, 0.114));
}

float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

float zigzag(float x) {
    return abs(mod(x, 2.) - 1.0);
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
    float gridCountX = 8.0;
    float gridCountY = 5.0;
    
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
    if (u_resolution.x > u_resolution.y) {
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

// マスクを計算（0.0 = 透明, 1.0 = 不透明）
float calculateMask(vec2 uv, int maskType) {
    vec2 centeredUV = uv - 0.5;
    
    if (maskType == 0) {
        // マスクなし（全体）
        return 1.0;
    } else if (maskType == 1) {
        // 四角形マスク
        float size = 0.3; // 四角形のサイズ
        float smoothEdge = 0.02;
        
        float maskX = smoothstep(size + smoothEdge, size - smoothEdge, abs(centeredUV.x));
        float maskY = smoothstep(size + smoothEdge, size - smoothEdge, abs(centeredUV.y));
        
        return maskX * maskY;
    } else if (maskType == 2) {
        // 円形マスク
        float dist = length(centeredUV);
        float radius = 0.3;
        float smoothEdge = 0.02;
        
        return smoothstep(radius + smoothEdge, radius - smoothEdge, dist);
    }
    
    return 1.0;
}

void main(void) {
    vec4 col = vec4(0.0, 0.0, 0.0, 1.0);
    vec2 uv = vTexCoord;
    uv -= vec2(0.5);
    uv.y *= u_resolution.y / u_resolution.x;
    uv += vec2(0.5);
    
    // 模様を選択
    vec3 patternColor;
    
    if (u_patternIndex == 0) {
        patternColor = noiseTexturePattern(uv, u_beat, u_time);
    } else if (u_patternIndex == 1) {
        patternColor = stripePattern(uv, u_beat, u_time);
    } else if (u_patternIndex == 2) {
        patternColor = dotPattern(uv, u_resolution, u_beat, u_time);
    } else if (u_patternIndex == 3) {
        patternColor = circlePattern(uv, u_beat, u_time);
    } else if (u_patternIndex == 4) {
        patternColor = gridPattern(uv, u_beat, u_time);
    } else if (u_patternIndex == 5) {
        patternColor = checkerboardPattern(uv, u_beat, u_time);
    } else if (u_patternIndex == 6) {
        patternColor = polkaDotPattern(uv, u_beat, u_time);
    } else if (u_patternIndex == 7) {
        patternColor = sunburstPattern(uv, u_beat, u_time);
    } else if (u_patternIndex == 8) {
        patternColor = gridLinePattern(uv, u_beat, u_time);
    } else if (u_patternIndex == 9) {
        patternColor = psychedelicSpiralPattern(uv, u_beat, u_time);
    } else {
        patternColor = noiseTexturePattern(uv, u_beat, u_time);
    }

    col.rgb = patternColor;
    
    gl_FragColor = col;
}