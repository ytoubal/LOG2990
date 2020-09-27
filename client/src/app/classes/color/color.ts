import * as CONSTANTS from '@app/constants/constants';

export class Color {
    private hexString: string;
    private redValue: number;
    private greenValue: number;
    private blueValue: number;
    private alpha: number;

    constructor(hex?: string, alpha?: number) {
        this.hexString = hex ? hex : CONSTANTS.BLACK;
        this.alpha = alpha ? alpha : CONSTANTS.DEFAULT_COLOR_OPACITY;
        this.computeRBGFromHex();
    }

    set red(value: number) {
        this.redValue = value;
        this.computeHexFromRGB();
    }

    set green(value: number) {
        this.greenValue = value;
        this.computeHexFromRGB();
    }

    set blue(value: number) {
        this.blueValue = value;
        this.computeHexFromRGB();
    }

    get hex(): string {
        return this.hexString;
    }

    set hex(value: string) {
        this.hexString = value;
        this.computeRBGFromHex();
    }

    get opacity(): number {
        return this.alpha;
    }

    set opacity(value: number) {
        if (value >= 0 && value <= 1) {
            this.alpha = value;
        }
    }

    setRedHex(hexValue: string): void {
        const bin = this.hexToBin(hexValue);
        if (bin !== null && bin > 0 && bin <= CONSTANTS.MAX_COLOR_VALUE) {
            this.red = bin;
        }
    }

    setGreenHex(hexValue: string): void {
        const bin = this.hexToBin(hexValue);
        if (bin !== null && bin > 0 && bin <= CONSTANTS.MAX_COLOR_VALUE) {
            this.green = bin;
        }
    }

    setBlueHex(hexValue: string): void {
        const bin = this.hexToBin(hexValue);
        if (bin !== null && bin > 0 && bin <= CONSTANTS.MAX_COLOR_VALUE) {
            this.blue = bin;
        }
    }

    getRedHex(): string {
        return this.binToHex(this.redValue);
    }

    getGreenHex(): string {
        return this.binToHex(this.greenValue);
    }

    getBlueHex(): string {
        return this.binToHex(this.blueValue);
    }

    toStringRGBA(): string {
        return `rgba(${this.redValue},${this.greenValue},${this.blueValue},${this.alpha})`;
    }

    private computeRBGFromHex(): void {
        const hexValue = this.hexString.replace('#', '');
        const redBin = this.hexToBin(hexValue.substring(0, CONSTANTS.RED_POSITION_IN_HEX_STRING));
        this.redValue = redBin !== null ? redBin : this.redValue;
        const greenBin = this.hexToBin(hexValue.substring(CONSTANTS.RED_POSITION_IN_HEX_STRING, CONSTANTS.GREEN_POSITION_IN_HEX_STRING));
        this.greenValue = greenBin !== null ? greenBin : this.greenValue;
        const blueBin = this.hexToBin(hexValue.substring(CONSTANTS.GREEN_POSITION_IN_HEX_STRING, CONSTANTS.BLUE_POSITION_IN_HEX_STRING));
        this.blueValue = blueBin !== null ? blueBin : this.blueValue;
    }

    private computeHexFromRGB(): void {
        this.hexString = '#' + this.binToHex(this.redValue) + this.binToHex(this.greenValue) + this.binToHex(this.blueValue);
    }

    private binToHex(bin: number): string {
        const hex = bin.toString(CONSTANTS.HEX_BASE);
        return hex.length === 1 ? '0' + hex : hex;
    }

    private hexToBin(hex: string): number | null {
        if (hex.match(/[0-9A-F]{1,2}$/i)) {
            return parseInt(hex, CONSTANTS.HEX_BASE);
        }
        return null;
    }
}