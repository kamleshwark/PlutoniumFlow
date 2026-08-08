import { startOfDay } from "date-fns";
import { CommonFunctions } from "../utilities/CommonFunctions";
import { ColorType } from "./Enums.enum";

export class CBTGPointTEchEco {
    ReportDate!: Date;
    TechWhite = 0;
    TechGreen = 0;
    TechYellow = 0;
    TechRed = 0;
    TechBlack = 0;
    EcoWhite = 0;
    EcoGreen = 0;
    EcoYellow = 0;
    EcoRed = 0;
    EcoBlack = 0;

    get Total(): number {
        return this.TechWhite + this.TechGreen + this.TechYellow + this.TechRed + this.TechBlack;
    }

    static readFromAPIResult(data: any[]): Array<CBTGPointTEchEco> {

        const points = new Array<CBTGPointTEchEco>();
        const length = data.length;
        for (let i = 0; i < length; i++) {
            const newPoint = new CBTGPointTEchEco();
            newPoint.readSingleFromAPIResult(data[i]);
            points.push(newPoint);
        }
        return points;
    }

    readSingleFromAPIResult(data: any) {
        this.ReportDate = startOfDay(new Date(data.ReportDate));
        this.TechWhite = data.TechWhite;
        this.TechGreen = data.TechGreen;
        this.TechYellow = data.TechYellow;
        this.TechRed = data.TechRed;
        this.TechBlack = data.TechBlack;
        this.EcoWhite = data.EcoWhite;
        this.EcoGreen = data.EcoGreen;
        this.EcoYellow = data.EcoYellow;
        this.EcoRed = data.EcoRed;
        this.EcoBlack = data.EcoBlack;

    }


}

export class CBTGPoint {
    ReportDate!: Date;
    White = 0;
    Green = 0;
    Yellow = 0;
    Red = 0;
    Black = 0;

    get Total(): number {
        return this.White + this.Green + this.Yellow + this.Red + this.Black;
    }

    get WhitePercent(): number {
        let result = -1;
        if (0 != this.Total) {
            result = Math.round(this.White / this.Total * 100);
        }
        return result;
    }
    get GreenPercent(): number {
        let result = -1;
        if (0 != this.Total) {
            result = Math.round(this.Green / this.Total * 100);
        }
        return result;
    }
    get YellowPercent(): number {
        let result = -1;
        if (0 != this.Total) {
            result = Math.round(this.Yellow / this.Total * 100);
        }
        return result;
    }
    get RedPercent(): number {
        let result = -1;
        if (0 != this.Total) {
            result = Math.round(this.Red / this.Total * 100);
        }
        return result;
    }
    get BlackPercent(): number {
        let result = -1;
        if (0 != this.Total) {
            result = Math.round(this.Black / this.Total * 100);
        }
        return result;
    }

    static getBTGPoint(src: CBTGPointTEchEco, colorType: ColorType): CBTGPoint {
        const btgPoint = new CBTGPoint();
        btgPoint.ReportDate = src.ReportDate;
        switch (colorType) {
            case ColorType.eTechnical:
                btgPoint.White = src.TechWhite;
                btgPoint.Green = src.TechGreen;
                btgPoint.Yellow = src.TechYellow;
                btgPoint.Red = src.TechRed;
                btgPoint.Black = src.TechBlack;
                break;
            case ColorType.eEconimical:
                btgPoint.White = src.EcoWhite;
                btgPoint.Green = src.EcoGreen;
                btgPoint.Yellow = src.EcoYellow;
                btgPoint.Red = src.TechRed;
                btgPoint.Black = src.EcoBlack;
                break;

            default:
                break;
        }
        return btgPoint;
    }

    getTooltip(): string {
        const data: any[] = [];
        data.push({ color: 'black', count: this.Black, perc: this.BlackPercent });
        data.push({ color: 'red', count: this.Red, perc: this.RedPercent });
        data.push({ color: 'yellow', count: this.Yellow, perc: this.YellowPercent });
        data.push({ color: 'green', count: this.Green, perc: this.GreenPercent });
        data.push({ color: 'white', count: this.White, perc: this.WhitePercent });

        let colorsHtml = '';
        data.forEach(colorData => {
            colorsHtml +=
                `
                        <tr>
                            <td >
                                <span class="status-color-block " style="background: ${colorData.color}"></span> 
                            </td>
                            <td >
                              <span class="field-value">${colorData.count}</span> 
                              <span class="info-header ">(${colorData.perc}%)</span>
                            </td>
                          </tr>
            `;
        });
        return (
            `       <div class="btg-tooltip-wrapper">
                        <div>
                            <span class="info-header me-2">${CommonFunctions.getInShortDateFormat(this.ReportDate)}</span>
                        </div>
                        <hr class="mt-1 mb-1">
                        <div class="btg-tooltip-table-wrapper">
                            <table>
                            ${colorsHtml}
                            </table>
                        </div>
                        <div>
                            <span class="info-header ">Total</span>
                            <span class="field-value">${this.Total}</span> 
                        </div>
                  <div>`
        );
    }
}
