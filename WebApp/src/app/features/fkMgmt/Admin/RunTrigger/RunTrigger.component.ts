import { Component, inject, OnInit } from '@angular/core';
import { interval, map, Subscription, take } from 'rxjs';
import { CBGJob } from 'src/app/models/BGJob';
import { BackgroundJobStatusCode } from 'src/app/models/Enums.enum';
import { AlertService } from 'src/app/services/Alert.service';
import { HttpService } from 'src/app/services/http.service';
import { AdminService } from 'src/app/theme/layout/admin/services/admin.service';
import { AlertSeverity } from 'src/app/utilities/Alert';
import { CommonFunctions } from 'src/app/utilities/CommonFunctions';

@Component({
  selector: 'app-RunTrigger',
  standalone: true,
  templateUrl: './RunTrigger.component.html',
  styleUrls: ['./RunTrigger.component.scss']
})
export default class RunTriggerComponent implements OnInit {

  commonFunctions = CommonFunctions;

  adminService = inject(AdminService);
  httpService = inject(HttpService);
  alertService = inject(AlertService);

  bgJob: CBGJob;

  runInProgress = true;
  waitUntilRefreshTrigger = 15;
  countDownSub: Subscription;
  refreshingIn: number;

  constructor() { }

  ngOnInit() {
    try {
      this.adminService.setPageTitle('Run Trigger');
      this.fetchJobStatus(0);
    } catch (ex) {
      console.log('Error initialising Run Trigger Component', ex);
      
    }
  }

  fetchJobStatus(jobId: number) {
    this.httpService.get('BGJob/GetJobStatus/' + jobId)
      .subscribe({
        next: (data) => {
          this.onGetJobStatus_Success(data);
        },
        error: (error) => {
          error.context = 'Failed getting Background job status';
          this.httpService.reportAPICallFailure(error);
        }
      });
  }

  onGetJobStatus_Success(response: any) {
    try {
      this.readJob(response);
    } catch (ex) {
      console.log('Error fetching job status', ex);
      this.alertService.show(AlertSeverity.eError, 'Failed fetching run status');
    }
  }

  getTimestamp(date: Date): string {
    try {
      return CommonFunctions.getDateInFormat(date, 'dd-MMM-yyyy HH:mm:ss');
    } catch (ex) {
      console.log('Error parsing date', ex);
    }

    return '';
  }

  onTriggerRunClick() {
    try {
      this.alertService.closeAll();
      this.runInProgress = true;
      this.bgJob = undefined;
      this.httpService.post('bgjob/TriggerDailyRun/', {})
      .subscribe({
        next: (data) => {
          this.onEnqueue_Success(data);
        },
        error: (error) => {
          error.context = 'Failed triggering a run';
          this.httpService.reportAPICallFailure(error);
          this.runInProgress = false;
        }
      });
    } catch (error) {
      this.runInProgress = false;
    }
  }

  onEnqueue_Success(response: any) {
    try {
      this.readJob(response.job);
    } catch (ex) {
      console.log('Failed triggering run', ex);
      this.alertService.show(AlertSeverity.eError, 'Failed triggering run');
    }
  }

  readJob(data: any) {
    this.bgJob = CBGJob.readSingleFromAPIResult(data);
    if (BackgroundJobStatusCode.eFinished === this.bgJob.Status
      || BackgroundJobStatusCode.eNone === this.bgJob.Status) {
      this.runInProgress = false;
    } else {
      this.startRefreshCountDown();
    }
  }

  startRefreshCountDown() {
    const countDown = interval(1000).pipe(
      map((elapsed) => this.waitUntilRefreshTrigger-elapsed-1),
      take(this.waitUntilRefreshTrigger)
    );

    this.stopCountDown();

    this.countDownSub = countDown.subscribe({
      next: (value) => {
        try {
          this.refreshingIn = value;
          console.log('refreshing', this.refreshingIn);
          if(0 === this.refreshingIn) {
            this.stopCountDown();
            setTimeout(() => {
              this.fetchJobStatus(this.bgJob.Id);
            }, 1000);
          }
        } catch (ex) {
          console.log('Error triggering auto refresh', ex);
        }
      }
    });
    this.refreshingIn = this.waitUntilRefreshTrigger;
    
  }

  stopCountDown() {
    if (CommonFunctions.isValid(this.countDownSub)) {
      this.countDownSub.unsubscribe();
    }
    this.refreshingIn = 0;
  }
}
