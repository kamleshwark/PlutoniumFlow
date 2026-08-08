import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { AlertService } from 'src/app/services/Alert.service';
import { HttpService } from 'src/app/services/http.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { UserService } from 'src/app/services/user.service';
import { AlertSeverity } from 'src/app/utilities/Alert';
import { CommonFunctions } from 'src/app/utilities/CommonFunctions';

@Component({
  selector: 'app-ChangePassword',
  standalone: true,
  imports: [ReactiveFormsModule,FontAwesomeModule],
  templateUrl: './ChangePassword.component.html',
  styleUrls: ['./ChangePassword.component.scss']
})
export default class ChangePasswordComponent implements OnInit {

  private alertService = inject(AlertService);
  private spinnerService = inject(SpinnerService);
  private userService = inject(UserService);
  private httpService = inject(HttpService);
  
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  changePasswordForm!: FormGroup;
  constructor(private router: Router) { }

  ngOnInit() {
    try {
      this.initializeForm();
    } catch (ex) {
      console.log('Error initialising Change Password Component', ex);

    }
  }

  private initializeForm(): void {
    this.changePasswordForm = new FormGroup(
      {
        currentPassword: new FormControl('', Validators.required),
        newPassword: new FormControl('', [Validators.required]),
        confirmPassword: new FormControl('', [Validators.required])
      },
      {
        validators: this.passwordMatchValidator()
      });
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (CommonFunctions.isValid(this.changePasswordForm)) {
        const newPassword = this.changePasswordForm.get('newPassword')!.value;
        const confirmPassword = this.changePasswordForm.get('confirmPassword')!.value;
        
        if (newPassword !== confirmPassword) {
          return { passwordMismatch: true };
        }
      }
      return null;
    };
  }

  onSubmit() {
    try {
      this.alertService.closeAll();
      this.changePasswordForm.markAllAsTouched();
      if (this.changePasswordForm.invalid) {
        this.alertService.show(AlertSeverity.eError, 'There are errors in data');
      } else {
        this.spinnerService.show();
        const api = 'users/ChangePassword';
        const oldPassword = this.changePasswordForm.get('currentPassword')!.value;
        const newPassword = this.changePasswordForm.get('newPassword')!.value;
        const apiData = {id: this.userService.getCurrentUserId(), OldPassword: oldPassword, NewPassword: newPassword};
        
        this.httpService.put(api, apiData).subscribe({
          next: (data) => {
            this.onChangePassword_Success(data);
          },
          error: (error) => {
            this.spinnerService.hide();
            error.context = 'Failed changing password';
            this.httpService.reportAPICallFailure(error);
          }
        });
      }
    } catch (ex) {
      this.spinnerService.hide();
      console.log(`Error saving remark`, ex);
      this.alertService.show(AlertSeverity.eError, `Error changing password`);
    }
  }

  private onChangePassword_Success(response: any): void {
    try {
      if (CommonFunctions.isValid(response) && 0 == response.errorCode) {
        this.alertService.show(AlertSeverity.eSuccess, `Password changed successfully`);
        this.router.navigate(['/auth/signin']);
      } else {
        this.alertService.show(AlertSeverity.eError, `Failed changing password. Reason: ${response.errors}`);
      }
    } catch (ex) {
      console.log('Error changing password', ex);
      this.alertService.show(AlertSeverity.eError, `Failed changing password`);
    } finally {
      this.spinnerService.hide();
    }
  }
}
