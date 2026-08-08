import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRotateLeft, faKey, faUnlock, faXmark } from '@fortawesome/free-solid-svg-icons';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { CUserForAddEdit } from 'src/app/models/User';
import { AlertService } from 'src/app/services/Alert.service';
import { AppConfigService } from 'src/app/services/app-config.service';
import { HttpService } from 'src/app/services/http.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { AlertSeverity } from 'src/app/utilities/Alert';

@Component({
  selector: 'app-UserActionsCellRenderer',
  standalone: true,
  imports: [NzPopconfirmModule, FontAwesomeModule, NzPopoverModule, FormsModule],
  templateUrl: './UserActionsCellRenderer.component.html',
  styleUrls: ['./UserActionsCellRenderer.component.scss']
})
export class UserActionsCellRendererComponent implements ICellRendererAngularComp {

  private httpService = inject(HttpService);
  private alertService = inject(AlertService);
  private spinnerService = inject(SpinnerService);
  private appConfigService = inject(AppConfigService);

  params: ICellRendererParams<any, any, any>;
  user: CUserForAddEdit;

  unlockIcon = faUnlock;
  passwordIcon = faKey;
  revertIcon = faArrowRotateLeft;
  closeIcon = faXmark;
  
  popupVisible = false;
  newPassword = this.appConfigService.defaultPassword;

  agInit(params: ICellRendererParams<any, any, any>): void {
    try {
      this.params = params;
      this.user = params.node.data as CUserForAddEdit;

    } catch (ex) {
      console.log('Error initialising User Actions Cell Renderer Component', ex);
    }
  }
  refresh(params: ICellRendererParams<any, any, any>): boolean {
    try {

      return true;
    } catch (ex) {
      console.log('Error refreshing User Actions Cell Renderer Component', ex);
      return false;
    }
  }

  onUnlockClick() {
    try {
      this.alertService.closeAll();
      this.spinnerService.show();

      this.httpService.put('users/unlockUser/' + this.user.Id, {})
        .subscribe({
          next: (data) => {
            this.onUnlockUser_Success(data);
          },
          error: (error) => {
            error.context = 'Failed unlocking user';
            this.httpService.reportAPICallFailure(error);
            this.spinnerService.hide();
          }
        });

    } catch (ex) {
      this.spinnerService.hide();
      console.log('Error unlocking user', ex);
      this.alertService.show(AlertSeverity.eError, 'Failed unlocking the user');
    }
  }


  onUnlockUser_Success(response: any) {
    try {
      if (true === response) {
        this.user.IsLocked = false;
        this.alertService.show(AlertSeverity.eSuccess, 'User unlocked successfully');
      } else {
        this.alertService.show(AlertSeverity.eError, 'Failed unlocking user');
      }
    } catch (ex) {
      console.log('Error unlocking user', ex);
      this.alertService.show(AlertSeverity.eError, 'Failed unlocking user');
    } finally {
      this.spinnerService.hide();
    }
  }

  onPasswordResetClick() {
    try {
      this.popupVisible = false;
      this.alertService.closeAll();
      this.spinnerService.show();

      const apiData = {id: this.user.Id, newPassword: this.newPassword};
      
      this.httpService.put('users/resetPassword/', apiData)
        .subscribe({
          next: (data) => {
            this.onResetPassword_Success(data);
          },
          error: (error) => {
            error.context = 'Failed resetting password';
            this.httpService.reportAPICallFailure(error);
            this.spinnerService.hide();
          }
        });
    } catch (ex) {
      this.spinnerService.hide();
      console.log('Error resetting password', ex);
      this.alertService.show(AlertSeverity.eError, 'Failed resetting password');
    }
  }

  onResetPassword_Success(response: any) {
    try {
      if (0 === response.errorCode) {
        this.alertService.show(AlertSeverity.eSuccess, 'Password reset successfully');
      } else {
        this.alertService.show(AlertSeverity.eError, 'Failed resetting password. Reasons:\n' + response.errors);
        this.newPassword = this.appConfigService.defaultPassword;
      }
    } catch (ex) {
      console.log('Error resetting password', ex);
      this.alertService.show(AlertSeverity.eError, 'Failed resetting password');
    } finally {
      this.spinnerService.hide();
    }
  }

  onCloseClick() {
    try {
      this.popupVisible = false;
    } catch (ex) {
      console.log('Error closing', ex);
    }
  }

}
