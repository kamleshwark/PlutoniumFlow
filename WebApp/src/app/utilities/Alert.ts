export enum AlertSeverity {
    eNone = 0,
    eSuccess,
    eInfo,
    eWarning,
    eError,
    eContrast,
    eSecondary
}
export class CAlert {
    
    private static SeverityMap = new Map<AlertSeverity, string>([
        [AlertSeverity.eNone, ''],
        [AlertSeverity.eSuccess, 'success'],
        [AlertSeverity.eInfo, 'info'],
        [AlertSeverity.eWarning, 'warn'],
        [AlertSeverity.eError, 'error'],
        [AlertSeverity.eContrast, 'contrast'],
        [AlertSeverity.eSecondary, 'secondary']
    ]);

    private static DurationMap = new Map<AlertSeverity, number>([
        [AlertSeverity.eNone, 3000],
        [AlertSeverity.eSuccess, 3000],
        [AlertSeverity.eInfo, 3000],
        [AlertSeverity.eWarning, 3000],
        [AlertSeverity.eError, 30000],
        [AlertSeverity.eContrast, 3000],
        [AlertSeverity.eSecondary, 3000]
    ]);



    Severity: AlertSeverity;
    Message: string;
    Duration?: number;

    static getSeverityText(severity: AlertSeverity): string {
        return this.SeverityMap.get(severity);
    }

    static getDefaultDuration(severity: AlertSeverity): number {
        return this.DurationMap.get(severity);
    }
 }


