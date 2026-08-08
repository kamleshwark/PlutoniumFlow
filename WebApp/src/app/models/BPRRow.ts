import { StatusColor } from "./Enums.enum";

export class CBPRRow {
    SKUCode = '';
    SKUName = '';
    LocationCode = '';
    LocationName = '';
    Norm = 0;
    Stock = 0;
    GIT = 0;
    LocationArea = '';
    SKUType = '';
    TechPenetration = 0;
    EcoPenetration = 0;
    TechColor = StatusColor.eNone;
    EcoColor = StatusColor.eNone;

    static readFromAPIResult(data: any[]): Array<CBPRRow> {

        const rows = new Array<CBPRRow>();
        const length = data.length;
        for (let i = 0; i < length; i++) {
            const newRow = new CBPRRow();
            newRow.readSingleFromAPIResult(data[i]);
            rows.push(newRow);
        }
        return rows;
    }

    readSingleFromAPIResult(data: any) {
        this.SKUCode = data.skuCode;
        this.SKUName = data.skuName;
        this.LocationCode = data.locationCode;
        this.LocationName = data.locationName;
        this.Norm = data.norm;
        this.Stock = data.stock;
        this.GIT = data.git;
        this.LocationArea = data.locationArea;
        this.SKUType = data.skuType;
        this.calculate();
    }

    calculate() {
        this.TechPenetration = (this.Norm - this.Stock)/this.Norm * 100;
        this.EcoPenetration = (this.Norm - this.Stock - this.GIT)/this.Norm * 100;
        this.TechColor = CBPRRow.getColorCode(this.TechPenetration);
        this.EcoColor = CBPRRow.getColorCode(this.EcoPenetration);
    }

    static getColorCode(penetration: number): number {
        let color = StatusColor.eNone;
        if (penetration < 0) {
            color = StatusColor.eWhite;
        } else if (penetration < 100 / 3) {
            color = StatusColor.eGreen;
        } else if (penetration < 100 * 2 / 3) {
            color = StatusColor.eYellow;
        } else if (penetration < 100) {
            color = StatusColor.eRed
        } else {
            color = StatusColor.eBlack;
        }

        return color;
    }

    static getColor(colorCode: StatusColor): string {
        let color = '';
        switch (colorCode) {
            case StatusColor.eWhite:
                color = 'white';
                break;
            case StatusColor.eGreen:
                color = 'green';
                break;
            case StatusColor.eYellow:
                color = 'yellow';
                break;
            case StatusColor.eRed:
                color = 'red';
                break;
            case StatusColor.eBlack:
                color = 'black';
                break;

            default:
                break;
        }

        return color;
    }

    static getAvailability(bprRows: CBPRRow[]): number {
        let result = -1;
        const totalCount = bprRows.length;
        if(totalCount>0) {
            const availableCount = bprRows.filter(b => 100 > b.TechPenetration).length;
            result = availableCount/totalCount*100;
        }
        return result;
    }

}


