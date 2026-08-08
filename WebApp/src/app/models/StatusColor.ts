import { StatusColor } from "./Enums.enum";

export class CStatusColor {
    static getColorName(colorCode: StatusColor): string {
        let color = '';
        switch (colorCode) {
            case StatusColor.eGreen:
                color = 'Green';
                break;
            case StatusColor.eYellow:
                color = 'Yellow';
                break;
            case StatusColor.eRed:
                color = 'Red';
                break;
            case StatusColor.eBlack:
                color = 'Black';
                break;
            default:
                break;
        }
        return color;
    }
}
