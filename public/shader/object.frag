precision mediump float;

varying vec2 vTexCoord;

uniform float u_beat;
uniform sampler2D u_tex;
uniform float u_time;
uniform vec2 u_resolution;
uniform int u_patternIndex;
uniform vec3 u_mainColor;  // メインカラー
uniform vec3 u_subColor;   // サブカラー
uniform int u_sceneIndex;

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
    vec4 col = vec4(0.0, 0.0, 0.0, 1.0);
    vec2 uv = vTexCoord;

    col = texture2D(u_tex, uv);

    if(u_sceneIndex == 12) {
        vec2 centerUV = vec2(0.5, 0.4);
        vec2 normUV = vec2(uv.x * u_resolution.x / u_resolution.y, uv.y);
        float d = distance(normUV, vec2(u_resolution.x / u_resolution.y * centerUV.x, centerUV.y));
        
        float radius = 0.35;
        float edge = 0.03; // エッジのぼかし幅
        float mask = 1.0 - smoothstep(radius - edge, radius, d);
        
        vec3 pattern = mod(floor(uv.x * 160.0) + floor(uv.y * 90.0), 2.0) == 0.0 ? vec3(1.0) : vec3(0.0);
        col = mix(col, vec4(pattern, 1.0), mask);
    }
    
    gl_FragColor = col;
}