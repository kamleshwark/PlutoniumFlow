export enum StatusColor {
    eNone = 0,
    eWhite = 10,
    eGreen = 20,
    eYellow = 30,
    eRed = 40,
    eBlack = 50,
}


export enum BackgroundJobCode {
    eNone = 0,
    eCalculation = 10,
    eSingleFKGateCalculation = 20,
    eAllFKGatesCalculation = 30
}
export enum BackgroundJobStatusCode {
    eNone = 0,
    eQueued = 10,
    eProcessing = 20,
    eFinished = 30,
    eError = 40,
    eCancelled = 50
}

export enum PreloadableComponent {
    eNone = 0,
    eProjectAddEditDrawer,
    eNewUserDrawer
}

export enum ReasonType {
    eNone = 0,
    eMajorReason,
    eMinorReason
}

export enum ParetoPeriod {
    eNone = 0,
    eDuration = 10,
    eDateRange = 20,
    eAllTime = 30
}

export enum WeekDay {
    eSunday = 0,
    eMonday,
    eTuesday,
    eWednesday,
    eThursday,
    eFriday,
    eSaturday
}

export enum ColorType {
    eNone=0,
    eTechnical,
    eEconimical
}

