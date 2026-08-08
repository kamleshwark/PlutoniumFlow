import { CommonFunctions } from "../utilities/CommonFunctions";
import { BackgroundJobCode, BackgroundJobStatusCode } from "./Enums.enum";

export class CBGJob {
    Id: number;
    Code: BackgroundJobCode;
    Status: BackgroundJobStatusCode;
    Params: any;
    CreatedOn: Date;
    StartedOn: Date;
    LastUpdatedOn: Date;

    getStatus(): string {
        let strStatus = 'unknown';
        switch (this.Status) {
            case BackgroundJobStatusCode.eCancelled:
                strStatus = 'Cancelled';
                break;
            case BackgroundJobStatusCode.eFinished:
                strStatus = 'Finished';
                break;
            case BackgroundJobStatusCode.eError:
                strStatus = 'Error';
                break;
            case BackgroundJobStatusCode.eProcessing:
                strStatus = 'In Progress';
                break;
            case BackgroundJobStatusCode.eQueued:
                strStatus = 'In Queue';
                break;
        
            default:
                break;
        }

        return strStatus;
    }

    static readSingleFromAPIResult(data: any): CBGJob {

        const job = new CBGJob();
        job.Id = data.id;
        job.Code = data.code as BackgroundJobCode;
        job.Status = data.status as BackgroundJobStatusCode;
        job.Params = data.params;
        job.CreatedOn = CommonFunctions.convertUtcToLocal(data.createdOn);
        if (CommonFunctions.isValid(data.startedOn)) {
            job.StartedOn = CommonFunctions.convertUtcToLocal(data.startedOn);
        }
        if (CommonFunctions.isValid(data.lastUpdatedOn)) {
            job.LastUpdatedOn = CommonFunctions.convertUtcToLocal(data.lastUpdatedOn);
        }
        return job;
    }

}
