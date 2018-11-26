export class Color {

    readonly min: number;
    readonly max: number;
    readonly val: number;

    constructor(min: number, max: number, val: number) {
        this.min = min;
        this.max = max;
        this.val = val;
    }

    GetColorFromRange(): string {

        const hsl: Ihsl = this.GetHSLColorFromRange(this.min, this.max, this.val);

        return this.ConvertHSLToRGB(hsl);
    }


    private GetHSLColorFromRange(min: number, max: number, val: number): Ihsl {
        let minHue = 1, maxHue = 0;
        let curPercent = (val - min) / (max - min);
        const hsl: Ihsl = {
            h: ((curPercent * (maxHue - minHue)) + minHue),
            s: 1,
            l: 0.5
        };
        return hsl;
    }

    private ConvertHSLToRGB(hsl: Ihsl) {
        let r, g, b;
        let h = hsl.h;
        let s = hsl.s;
        let l = hsl.l;

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;
            r = this.ConvertHUEToRGB(p, q, h + 1 / 3);
            g = this.ConvertHUEToRGB(p, q, h);
            b = this.ConvertHUEToRGB(p, q, h - 1 / 3);
        }

        return '#' + this.ConvertToHex(r) + this.ConvertToHex(g) + this.ConvertToHex(b);
    }

    private ConvertToHex(x: number): string {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    private ConvertHUEToRGB(p, q, t) {
        if (t < 0) { t += 1 };
        if (t > 1) { t -= 1 };
        if (t < 1 / 6) { return p + (q - p) * 6 * t };
        if (t < 1 / 2) { return q };
        if (t < 2 / 3) { return p + (q - p) * (2 / 3 - t) * 6 };
        return p;
    }
}

export interface Ihsl {
    h: number;
    s: number;
    l: number;
}

export class RGB {
    r: number;
    g: number;
    b: number;
}
