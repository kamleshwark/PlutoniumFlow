import { Component, inject, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { CUserForAddEdit, CUserRoleSelection } from 'src/app/models/User';
import { AlertService } from 'src/app/services/Alert.service';
import { AppConfigService } from 'src/app/services/app-config.service';
import { HttpService } from 'src/app/services/http.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { UserService } from 'src/app/services/user.service';
import { AdminService } from 'src/app/theme/layout/admin/services/admin.service';
import { AlertSeverity } from 'src/app/utilities/Alert';
import { CommonFunctions } from 'src/app/utilities/CommonFunctions';

@Component({
  selector: 'app-NewUserDrawer',
  standalone: true,
  imports: [ReactiveFormsModule, NzPopconfirmModule, FormsModule],
  templateUrl: './NewUserDrawer.component.html',
  styleUrls: ['./NewUserDrawer.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None
})
export class NewUserDrawerComponent implements OnInit {
  private alertService = inject(AlertService);
  private adminService = inject(AdminService);
  private appConfigService = inject(AppConfigService);
  private spinnerService = inject(SpinnerService);
  private httpService = inject(HttpService);
  private userService = inject(UserService);

  newUserForm: FormGroup;
  isModified = false;
  maxUsernameSize = CUserForAddEdit.MAX_USER_NAME_SIZE;
  maxFullNameSize = CUserForAddEdit.MAX_FULL_NAME_SIZE;
  rolesSelection: CUserRoleSelection[];

  constructor() {}

  ngOnInit() {
    try {
      this.buildRoleSelection();
      this.initializeForm();
    } catch (ex) {
      console.log('Error initialising New User Drawer Component', ex);
    }
  }

  initializeForm() {
    this.newUserForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.maxLength(this.maxUsernameSize)]),
      fullname: new FormControl('', [Validators.maxLength(this.maxFullNameSize)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl(this.appConfigService.defaultPassword, [Validators.required])
    });
  }

  onUsernameChange() {
    try {
      this.isModified = true;
    } catch (ex) {
      console.log('Error handling username change', ex);
      this.alertService.show(AlertSeverity.eError, 'Failed handling username change');
    }
  }

  onFullNameChange() {
    try {
      this.isModified = true;
    } catch (ex) {
      console.log('Error handling full name change', ex);
      this.alertService.show(AlertSeverity.eError, 'Failed handling full name change');
    }
  }

  onEmailChange() {
    try {
      this.isModified = true;
    } catch (ex) {
      console.log('Error handling email change', ex);
      this.alertService.show(AlertSeverity.eError, 'Failed handling email change');
    }
  }

  onResetClick() {
    try {
      this.alertService.closeAll();
      if (this.newUserForm.dirty) {
        this.newUserForm.reset();
      }
      this.isModified = false;
    } catch (ex) {
      console.log('Failed to reset data', ex);
      this.alertService.show(AlertSeverity.eError, 'Failed to reset data');
    }
  }

  onSaveClick() {
    try {
      this.alertService.closeAll();
      this.newUserForm.markAllAsTouched();

      if (this.newUserForm.invalid) {
        this.alertService.show(AlertSeverity.eError, 'One or many fields have invalid values.');
      } else {
        const newUser = new CUserForAddEdit();
        newUser.Username = this.newUserForm.get('username').value.trim();
        newUser.FullName = this.newUserForm.get('fullname').value.trim();
        newUser.EMail = this.newUserForm.get('email').value.trim();
        newUser.Password = this.newUserForm.get('password').value.trim();
        newUser.Roles = this.rolesSelection.filter((sel) => sel.Selected).map((sel) => sel.Role);

        const apiData = newUser.getDataForRegisterAPI();

        this.spinnerService.show();
        this.httpService.post('users/Register/', apiData).subscribe({
          next: (data) => {
            this.onRegister_Success(data, newUser);
          },
          error: (error) => {
            error.context = 'Failed creating user';
            this.httpService.reportAPICallFailure(error);
            this.spinnerService.hide();
          }
        });
      }
    } catch (ex) {
      this.alertService.show(AlertSeverity.eError, 'Failed creating user');
      console.log('Failed creating user', ex);
      this.spinnerService.hide();
    }
  }

  onRegister_Success(response: any, newUser: CUserForAddEdit) {
    try {
      if (0 === response.errorCode) {
        newUser.Id = response.newUserId;
        this.alertService.show(AlertSeverity.eSuccess, 'User created successfully');
        this.userService.reportNewUserAdded(newUser);
        this.closeDrawer();
      } else {
        this.alertService.show(AlertSeverity.eError, 'Failed creating user. Reason: ' + response.errors);
      }
    } catch (ex) {
      console.log('Error creating user', ex);
      this.alertService.show(AlertSeverity.eError, 'Failed creating user');
    } finally {
      this.spinnerService.hide();
    }
  }

  onCloseClick() {
    try {
      this.alertService.closeAll();
      this.closeDrawer();
    } catch (ex) {
      console.log('Error closing new user screen', ex);
      this.alertService.show(AlertSeverity.eError, 'Failed closing new user screen');
    }
  }

  closeDrawer() {
    this.adminService.closeDrawer();
  }

  buildRoleSelection() {
    this.rolesSelection = [];
    const allRoles = this.userService.getAllUserRoles();
    allRoles.forEach((role) => {
      this.rolesSelection.push(new CUserRoleSelection(role, false));
    });
  }
}
