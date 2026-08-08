import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver-es';

export class HeavyCommonFunctions {
    public static exportToExcelFile(filename: string, rows: object[], headers: string[] = []) {

        let worksheet;
        if (0 === rows.length) {
            // Create a header-only row
            worksheet = XLSX.utils.aoa_to_sheet([headers]);
        } else {
            // Create worksheet from rows
            worksheet = XLSX.utils.json_to_sheet(rows);
        }

        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, `${filename}.xlsx`);
    }
}
