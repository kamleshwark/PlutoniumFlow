import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { GridApi, CsvExportParams } from 'ag-grid-community';
import Enumerable from "linq";
import { StatusColor } from "../models/Enums.enum";
import { startOfDay, format, isEqual, isValid } from "date-fns";

export class CommonFunctions {

    public static isNaN(obj: any): boolean {
        return this.isNull(obj) || isNaN(obj);
    }

    public static isNull(obj: any): boolean {
        return !this.isValid(obj);
    }

    public static isValid(obj: any): boolean {
        return typeof(obj) !== "undefined" && null !== obj;
    }

    public static isStringNullOrEmpty(str: string): boolean {
        return (!this.isValid(str) || !str || 0 === str.length);
    }

    public static getDateComparator() {
        return {
            comparator: (filterDate, cellValue) => {
                const cellDate = new Date(cellValue);
                if (cellDate < filterDate) return -1;
                if (cellDate > filterDate) return 1;
                return 0;
            }
        }
    }

    public static getInShortDateFormat(date: any) {
        return CommonFunctions.getDateInFormat(date, 'dd-MMM-yyyy');
    }

    public static getDateInAPIFormat(date: any) {
        return CommonFunctions.getDateInFormat(date, 'yyyy-MM-dd')
    }

    public static getDateInFormat(date: any, strFormat: string) {
        if (CommonFunctions.isValid(date) && isValid(new Date(date))) {
            return format(date, strFormat);
        } else {
            return undefined;
        }
    }

    public static removeItem<T>(list: T[], item:T) {
        const index = list.indexOf(item);
        if(0<=index) {
            list.splice(index, 1);
        }
    }

    public static removeItems<T>(list: T[], items:T[]) {
        items.forEach(item => {
            CommonFunctions.removeItem(list, item);
        });
    }

    public static exists<T>(list: T[], item:T) {
        return 0 <= list.indexOf(item);
    }

    public static insertItem<T>(list: T[], item:T, index: number) {
        if(0<=index) {
            list.splice(index, 0, item);
        }
    }

    public static cloneList(list: any[]): any[] {
        return list.map(item => item);
    }

    public static integerValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            const isInteger = /^-?\d+$/.test(value);
            const isBlank = CommonFunctions.isStringNullOrEmpty(value);

            return (isInteger || isBlank) ? null : { notInteger: true };
        };
    }

    public static exportGridDataTOCsv(fileName: string, gridApi: GridApi<any>) {
        const params: CsvExportParams = {};

        params.fileName = fileName;
        params.columnKeys = Enumerable.from(gridApi.getColumnDefs())
            .where((col: any) => CommonFunctions.isNull(col.suppressCsvExport) || false === col.suppressCsvExport)
            .select((col: any) => col.colId)
            .toArray();

        gridApi.exportDataAsCsv(params);
    }

    public static convertTo2PlacesIfDecimal(num: number): number {
        let result = num;
        if (0 !== result % 1) {
            result = Math.round(result * 100) / 100; // Round to two decimal places
        }
        return result;
    }

    public static trimAllValues(data: any[]) {
        const props = Object.keys(data[0]);
        data.forEach(row => {
            props.forEach(prop => {
                row[prop] = row[prop].trim();
            });
        });
    }

    public static getColorName(colorCode: StatusColor): string {
        let result = '';
        switch (colorCode) {
            case StatusColor.eGreen:
                result = 'green'
                break;
            case StatusColor.eYellow:
                result = 'yellow'
                break;
            case StatusColor.eRed:
                result = 'red'
                break;
            case StatusColor.eBlack:
                result = 'black'
                break;
            case StatusColor.eWhite:
                result = 'white'
                break;
            default:
                break;
        }
        return result;
    }

    public static getToday(): Date {
        return startOfDay(new Date());
    }

    public static convertUtcToLocal(strDate: string): Date {
        const isoUtc = strDate.replace(' ', 'T').slice(0, 23) + 'Z';
        return new Date(isoUtc);
    }

    public static isValidDateString(dateStr: string): boolean {
        if (CommonFunctions.isStringNullOrEmpty(dateStr)) {
            return false;
        } else {
            const date = new Date(dateStr);
            return !isNaN(date.getTime());
        }
    }

    public static isSameDay(date1: Date, date2: Date): boolean {
        const areDatesNull = !CommonFunctions.isValid(date1) && !CommonFunctions.isValid(date2);
        let result: boolean;
        if (areDatesNull) {
            result = true;
        } else {
            result = isEqual(startOfDay(date1), startOfDay(date2));
        }
        return result;
    }

    public static darkenHexColor(hex: string, percentage: number): string {

        hex = hex.startsWith('#') ? hex.slice(1) : hex;

        // Convert hex to RGB
        let r = parseInt(hex.slice(0, 2), 16);
        let g = parseInt(hex.slice(2, 4), 16);
        let b = parseInt(hex.slice(4, 6), 16);

        // Calculate the amount to darken
        r = Math.max(0, r - (r * percentage) / 100);
        g = Math.max(0, g - (g * percentage) / 100);
        b = Math.max(0, b - (b * percentage) / 100);

        // Convert back to hex
        const darkenedHex = `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;

        return darkenedHex;
    }

    public static arraysMatchIgnoreOrder(arr1: number[], arr2: number[]): boolean {
        if (arr1.length !== arr2.length) return false;

        const sorted1 = [...arr1].sort((a, b) => a - b);
        const sorted2 = [...arr2].sort((a, b) => a - b);

        return sorted1.every((val, index) => val === sorted2[index]);
    }

    public static trimWithEllipsis(str: string, maxLength: number = 20): string {
        return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
    }

    public static isValidEmail(email: string): boolean {
        if (!email) return false;

        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$/;
        return regex.test(email.trim());
    }
}
