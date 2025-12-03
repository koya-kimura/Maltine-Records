precision mediump float;

varying vec2 vTexCoord;

uniform float u_beat;
uniform float u_time;
uniform vec2 u_resolution;
uniform int u_patternType; // 0: 縞模様, 1: 水玉, 2: 円, 3: グリッド
uniform int u_maskType;    // 0: なし（全体）, 1: 四角形, 2: 円

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

// 縞模様を生成
vec3 stripePattern(vec2 uv, float beat, float time) {
    float stripeCount = 20.0 + sin(beat * 0.5) * 5.0;
    float pattern = zigzag(floor(uv.y * stripeCount) + 1.0);
    
    // 色を変化させる
    vec3 color1 = vec3(
        0.5 + 0.5 * sin(time * 1.5),
        0.5 + 0.5 * sin(time * 1.5 + PI * 2.0 / 3.0),
        0.5 + 0.5 * sin(time * 1.5 + PI * 4.0 / 3.0)
    );
    vec3 color2 = vec3(0.1);
    
    return mix(color2, color1, pattern);
}

// 水玉模様を生成
vec3 dotPattern(vec2 uv, vec2 resolution, float beat, float time) {
    float gridSize = 8.0 + sin(beat * 0.5) * 2.0;
    
    vec2 mosaicUV = mosaic(uv, resolution, gridSize);
    vec2 gridUV = fract(mosaicUV * gridSize);
    
    vec2 gridCenter = gridUV - 0.5;
    float dist = length(gridCenter);
    
    float radius = 0.3 + sin(beat * PI * 2.0) * 0.1;
    
    vec3 dotColor = vec3(
        0.5 + 0.5 * sin(time * 2.0),
        0.5 + 0.5 * sin(time * 2.0 + PI * 2.0 / 3.0),
        0.5 + 0.5 * sin(time * 2.0 + PI * 4.0 / 3.0)
    );
    
    vec3 bgColor = vec3(0.1);
    
    float smoothEdge = 0.02;
    float circle = smoothstep(radius + smoothEdge, radius - smoothEdge, dist);
    
    return mix(bgColor, dotColor, circle);
}

// 円模様を生成（中心からの同心円）
vec3 circlePattern(vec2 uv, float beat, float time) {
    vec2 centeredUV = uv - 0.5;
    float dist = length(centeredUV);
    
    float circleCount = 10.0 + sin(beat * 0.3) * 3.0;
    float pattern = zigzag(floor(dist * circleCount * 2.0) + 1.0);
    
    vec3 color1 = vec3(
        0.5 + 0.5 * sin(time * 1.2),
        0.5 + 0.5 * sin(time * 1.2 + PI * 2.0 / 3.0),
        0.5 + 0.5 * sin(time * 1.2 + PI * 4.0 / 3.0)
    );
    vec3 color2 = vec3(0.1);
    
    return mix(color2, color1, pattern);
}

// グリッド模様を生成
vec3 gridPattern(vec2 uv, float beat, float time) {
    float gridSize = 15.0 + sin(beat * 0.4) * 5.0;
    
    float gridX = zigzag(floor(uv.x * gridSize) + 1.0);
    float gridY = zigzag(floor(uv.y * gridSize) + 1.0);
    float pattern = max(gridX, gridY);
    
    vec3 color1 = vec3(
        0.5 + 0.5 * sin(time * 1.8),
        0.5 + 0.5 * sin(time * 1.8 + PI * 2.0 / 3.0),
        0.5 + 0.5 * sin(time * 1.8 + PI * 4.0 / 3.0)
    );
    vec3 color2 = vec3(0.1);
    
    return mix(color2, color1, pattern);
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