export class CGridColumnFilterOption {
    DisplayText: string;
    Value: any;
    isSelected: boolean;

    constructor(text: string, val: any, selected: boolean) {
        this.DisplayText = text;
        this.Value = val;
        this.isSelected = selected;
    }
}
