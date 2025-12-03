precision mediump float;

varying vec2 vTexCoord;

uniform sampler2D u_tex;
uniform vec2 u_resolution;

// グレースケール変換
float gray(vec3 col) {
    return dot(col, vec3(0.299, 0.587, 0.114));
}

void main(void) {
    vec2 uv = vTexCoord;
    
    // テクスチャから色を取得
    vec4 texColor = texture2D(u_tex, uv);
    
    // モノクロエフェクト
    float grayValue = gray(texColor.rgb);
    vec3 monoColor = vec3(grayValue);
    
    gl_FragColor = vec4(monoColor, texColor.a);
}
