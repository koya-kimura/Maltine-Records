export const angleClamp = (angle: number): number => {
    return angle % (Math.PI * 2);
}

export const lerp = (a: number, b: number, t: number): number => {
    return a + (b - a) * Math.min(Math.max(t, 0), 1);
}

export const map = (value: number, inMin: number, inMax: number, outMin: number, outMax: number): number => {
    return outMin + ((value - inMin) * (outMax - outMin)) / (inMax - inMin);
}

export const fract = (value: number): number => {
    return value - Math.floor(value);
}