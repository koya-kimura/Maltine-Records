precision mediump float;

varying vec2 vTexCoord;

uniform float u_beat;
uniform float u_time;
uniform vec2 u_resolution;
uniform int u_patternType; // 0-9: 10種類のパターン
uniform int u_maskType;    // 0: なし（全体）, 1: 四角形, 2: 円
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

// パターン4: 波打つ垂直線（4キー）- 太さ0.7倍
vec3 gridPattern(vec2 uv, float beat, float time) {
    // 線の数（太さ0.7倍 = 数を増やす: 10 / 0.7 ≈ 14.29）
    float lineCount = 14.29;
    
    // beatに基づいて線を移動
    float movement = beat * 0.05;
    
    // 横方向に大きく波打つ（sinで変形）
    float wave = sin(uv.y * PI * 4.0 + time * 2.0) * 0.3; // 大きな波
    
    // 波打つ垂直線パターン
    float pattern = mod(floor((uv.x + wave + movement) * lineCount), 2.0);
    
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
    vec2 uv = vTexCoord;
    
    // 模様を選択
    vec3 patternColor;
    
    if (u_patternType == 0) {
        patternColor = stripePattern(uv, u_beat, u_time);
    } else if (u_patternType == 1) {
        patternColor = dotPattern(uv, u_resolution, u_beat, u_time);
    } else if (u_patternType == 2) {
        patternColor = circlePattern(uv, u_beat, u_time);
    } else if (u_patternType == 3) {
        patternColor = gridPattern(uv, u_beat, u_time);
    } else {
        patternColor = stripePattern(uv, u_beat, u_time);
    }
    
    // マスクを適用
    float mask = calculateMask(uv, u_maskType);
    
    // 背景色（マスク外の部分）
    vec3 bgColor = vec3(0.0);
    
    // マスクで合成
    vec3 finalColor = mix(bgColor, patternColor, mask);
    
    // アルファ値は常に1.0（完全不透明）
    float alpha = 1.0;
    
    gl_FragColor = vec4(finalColor, alpha);
}