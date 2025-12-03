precision mediump float;

varying vec2 vTexCoord;

uniform float u_beat;
uniform float u_time;
uniform vec2 u_resolution;

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

void main(void) {
    vec2 uv = vTexCoord;
    
    // UV座標を中心基準に変換（-0.5 ~ 0.5の範囲）
    vec2 centeredUV = uv - 0.5;
    
    // アスペクト比を考慮した座標
    vec2 aspectUV = centeredUV * vec2(u_resolution.x / u_resolution.y, 1.0);
    
    // 水玉模様のグリッド数（ビートに応じて変化）
    float gridSize = 8.0 + sin(u_beat * 0.5) * 2.0;
    
    // モザイク状のUV座標を計算
    vec2 mosaicUV = mosaic(uv, u_resolution, gridSize);
    vec2 gridUV = fract(mosaicUV * gridSize);
    
    // グリッドの中心からの距離を計算
    vec2 gridCenter = gridUV - 0.5;
    float dist = length(gridCenter);
    
    // 水玉の半径（ビートに応じて脈動）
    float radius = 0.3 + sin(u_beat * PI * 2.0) * 0.1;
    
    // 水玉の色（時間に応じて変化）
    vec3 dotColor = vec3(
        0.5 + 0.5 * sin(u_time * 2.0),
        0.5 + 0.5 * sin(u_time * 2.0 + PI * 2.0 / 3.0),
        0.5 + 0.5 * sin(u_time * 2.0 + PI * 4.0 / 3.0)
    );
    
    // 背景色
    vec3 bgColor = vec3(0.1);
    
    // 水玉をスムーズに描画（アンチエイリアシング）
    float smoothEdge = 0.02;
    float circle = smoothstep(radius + smoothEdge, radius - smoothEdge, dist);
    
    // 最終的な色を計算
    vec3 finalColor = mix(bgColor, dotColor, circle);
    
    gl_FragColor = vec4(finalColor, 1.0);
}