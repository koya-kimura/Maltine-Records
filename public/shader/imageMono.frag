precision mediump float;

varying vec2 vTexCoord;
uniform int u_isLife;
uniform sampler2D u_tex;
uniform vec2 u_resolution;

float PI = 3.14159265358979;

// グレースケール変換
float gray(vec3 col) {
    return dot(col, vec3(0.299, 0.587, 0.114));
}

// コントラスト調整
float adjustContrast(float value, float contrast) {
    return clamp((value - 0.5) * contrast + 0.5, 0.0, 1.0);
}

vec3 maxRGB(vec3 color) {
    if(color.r >= color.g && color.r >= color.b && color.r > 0.2) {
        return vec3(color.r, 0.0, 0.0); // Red
    } else if(color.g >= color.r && color.g >= color.b && color.g > 0.2) {
        return vec3(0.0, color.g, 0.0); // Green
    }
    else if(color.b >= color.r && color.b >= color.g && color.b > 0.2) {
        return vec3(0.0, 0.0, color.b); // Blue
    }
}

float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main(void) {
    vec2 uv = vTexCoord;
    
    // テクスチャから色を取得
    vec4 texColor = texture2D(u_tex, uv);
    
    // 元々透明な部分はドットを描かずに透明のまま返す
    if (texColor.a < 0.1) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
        return;
    }
    
    // グレースケール変換
    float grayValue = gray(texColor.rgb);
    
    // コントラストを強める（1.0より大きい値で強調）
    float contrastValue = 1.8;
    grayValue = adjustContrast(grayValue, contrastValue);

    // 最終的な色（ドットは黒、背景は白）
    vec3 finalColor = vec3(grayValue);

    if(maxRGB(texColor.rgb).g > 0.0 && u_isLife == 1) {
finalColor = vec3(mod(floor(uv.x * 128.0) + floor(uv.y * 72.0), 2.0) == 0.0 ? 1.0 : 0.0); // Blue dots
    }
    
    // 元のアルファ値を保持
    gl_FragColor = vec4(finalColor, texColor.a);
}
