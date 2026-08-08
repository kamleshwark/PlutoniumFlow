import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Component, inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { distinctUntilChanged, forkJoin, Subscription, tap } from 'rxjs';
import { BreakPointService } from './services/breakPoint.service';
import { UserService } from './services/user.service';
import { SpinnerService } from './services/spinner.service';
import { HttpService } from './services/http.service';
import { CommonFunctions } from './utilities/CommonFunctions';
import { AlertSeverity } from './utilities/Alert';
import { AlertService } from './services/Alert.service';
import { CUser } from './models/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {
  
  private userService = inject(UserService);
  private spinnerService = inject(SpinnerService);
  private httpService = inject(HttpService);
  private breakPointObserver = inject(BreakpointObserver);
  private breakPointService = inject(BreakPointService);
  private alertService = inject(AlertService);

  private subs:Subscription[] = [];

  constructor(private router: Router) { }
  
  ngOnInit() {
    try {
      this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
          return;
        }
        window.scrollTo(0, 0);
      });

      this.breakPointObserver.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
        .pipe(
          tap(value => console.log(value)),
          distinctUntilChanged()
        ).subscribe(() =>
          this.onBreakpointChanged()
        );

        this.userService.setUserFromStorage();
        if (this.userService.isTokenValid()) {
          console.log('User Token valid');
        } else {
          this.router.navigate(['/auth/signin']);
        }

        let sub = this.userService.loginObservable.subscribe({
          next:(data) => {
            if(data) {
              this.onLogin();
            }
          }
        });
        this.subs.push(sub);

        sub = this.httpService.apiCallFailureObservable.subscribe({
          next:(data) => this.onAPICallFailure(data)
        });
        this.subs.push(sub);
        
        if(this.userService.isTokenValid()){
          this.FetchCommonData()
        }
        
    } catch (ex) {
      console.log('Error initialising app', ex);

    }
  }

  onAPICallFailure(error: any) {
    try {
      if(CommonFunctions.isValid(error)){
        let context = error.context;
        if(CommonFunctions.isNull(context)) {
          context = 'Failed Loading/Saving data';
        }

        if (401 === error.status) {
          this.alertService.show(AlertSeverity.eError, 'You are currently not logged in. Login again.');
        } else if (403 === error.status) {
          this.alertService.show(AlertSeverity.eError, 'You do not have access to this functionality');
        } 
        else {
          this.alertService.show(AlertSeverity.eError, context);
        }
        console.log(context, error);
      }
    } catch (ex) {
      console.log('Error responding to API call failure', ex);
    }
  }

  ngOnDestroy(): void {
    try {
      this.subs.map(sub => sub.unsubscribe());
    } catch (ex) {
      console.log('Error in on destroy', ex);
      
    }
  }


  private onLogin() {
    try {
      this.FetchCommonData();
    } catch (ex) {
      console.log('Error processing login', ex);
      
    }
  }
  private onBreakpointChanged() {
    try {
      let currentBreakpoint = '';
      for (const key of Object.keys(Breakpoints) as Array<keyof typeof Breakpoints>) {
        if (Breakpoints.hasOwnProperty(key)) {
          let value = Breakpoints[key];
          if (this.breakPointObserver.isMatched(value)) {
            currentBreakpoint = value;
            break;
          }
        }
      }
      this.breakPointService.reportBreakPointChange(currentBreakpoint);
    } catch (ex) {
      console.log('Error handling breakpoint change', ex);

    }
  }

  FetchCommonData() {
    try {
      console.log('Fetching common data');
      
      this.spinnerService.show();
      forkJoin({
        issueActionOwners: this.httpService.get('users/GetIssueActionOwners'),
        taskManagers: this.httpService.get('users/GetUsersInRole/TaskManager'),
        taskParticipants: this.httpService.get('users/GetUsersInRole/TaskParticipant'),
        projectManagers: this.httpService.get('users/GetUsersInRole/ProjectManager'),
        fkGateManagers: this.httpService.get('users/GetUsersInRole/FKGateManager'),
        allRoles: this.httpService.get('users/GetAllRoles')
      }).subscribe({
        next: (data) => {
          this.onFetchCommonData_Success(data);
        },
        error: (er) => {
          this.spinnerService.hide();
          er.context = 'Error fetching Common data';
          this.httpService.reportAPICallFailure(er);
        }
      });
    } catch (ex) {
      console.log('Error calling Common Data API', ex);
      this.spinnerService.hide();
    }
  }

  onFetchCommonData_Success(data: any) {
    try {
      
      this.userService.setAllUserRoles(data.allRoles);
    } catch (ex) {
      console.log('Error reading Common data', ex);
    } finally {
      this.spinnerService.hide();
      console.log('Fetching common data finished');
    }
  }
}
