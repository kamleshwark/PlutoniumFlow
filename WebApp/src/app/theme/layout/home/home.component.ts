import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./home.component.scss']
})
export default class HomeComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);
  constructor() {}

  ngOnInit() {
    try {
      let redirectRoute = '';
      if (
        this.userService.isUserInRole('Admin') ||
        this.userService.isUserInRole('ProjectManager') ||
        this.userService.isUserInRole('TopManagement')
      ) {
        redirectRoute = 'fkmgmt/ccpm-dashboard';
      } else if (this.userService.isUserInRole('FKManager')) {
        redirectRoute = 'fkmgmt/fkstatus/main';
      } else if (this.userService.isUserInRole('TaskManager')) {
        redirectRoute = 'fkmgmt/task-updates';
      } else if (this.userService.isUserInRole('TaskParticipant')) {
        redirectRoute = 'fkmgmt/task-updates';
      } else if (this.userService.isUserInRole('Updater')) {
        redirectRoute = 'fkmgmt/fkexecute/main';
      }
      this.router.navigate([redirectRoute]);
    } catch (ex) {
      console.log('Error initialising home component');
    }
  }
}
