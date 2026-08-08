import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLock, faPencil, faXmark } from '@fortawesome/free-solid-svg-icons';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import Enumerable from 'linq';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { CUserForAddEdit, CUserRoleSelection } from 'src/app/models/User';
import { AlertService } from 'src/app/services/Alert.service';
import { HttpService } from 'src/app/services/http.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { UserService } from 'src/app/services/user.service';
import { AlertSeverity } from 'src/app/utilities/Alert';

@Component({
  selector: 'app-RoleSetterCellRenderer',
  standalone: true,
  imports: [NzPopoverModule, FontAwesomeModule, FormsModule],
  templateUrl: './RoleSetterCellRenderer.component.html',
  styleUrls: ['./RoleSetterCellRenderer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RoleSetterCellRendererComponent implements ICellRendererAngularComp {

  private userService = inject(UserService);
  private alertService = inject(AlertService);
  private spinnerService = inject(SpinnerService);
  private httpService = inject(HttpService);

  closeIcon = faXmark;
  tpSelectionIcon = faPencil;
  
  user: CUserForAddEdit;
  params: ICellRendererParams<any, any, any>;
  rolesSelection: CUserRoleSelection[];
  popupVisible = false;
  selectedRoleCount = 0;

  constructor() { }

  agInit(params: ICellRendererParams<any, any, any>): void {
    try {
      this.initialise(params);
    } catch (ex) {
      console.log('Error initialising Role Setter Cell Renderer Component', ex);
    }
  }

  buildRoleSelection() {
    this.rolesSelection = [];
    const allRoles = this.userService.getAllUserRoles();
    allRoles.forEach(role => {
      const isSelected = this.user.Roles.includes(role);
      this.rolesSelection.push(new CUserRoleSelection(role, isSelected));
    });
    this.rolesSelection = Enumerable.from(this.rolesSelection)
      .orderBy(sel => !sel.Selected)
      .thenBy(sel => sel.Role.toLowerCase())
      .toArray();
    this.updateCount();
  }

  updateCount() {
    this.selectedRoleCount = this.rolesSelection.filter(sel => sel.Selected).length;
  }

  initialise(params: ICellRendererParams<any, any, any>) {
    this.params = params;

    this.user = params.data as CUserForAddEdit;
    this.buildRoleSelection();
  }

  refresh(params: ICellRendererParams<any, any, any>): boolean {
    try {
      this.initialise(params);
    } catch (ex) {
      console.log('Error refreshing Role Setter Cell Renderer Component', ex);
    }

    return true;
  }

  onSaveClick() {
    try {
      this.alertService.closeAll();

      this.spinnerService.show();
      const data = {
        id: this.user.Id,
        roles: this.rolesSelection.filter(sel => sel.Selected).map(sel => sel.Role)
      }
      this.httpService.put('users/UpdateRoles/', data)
        .subscribe({
          next: (data) => {
            this.onUpdateRoles_Success(data);
          },
          error: (error) => {
            error.context = 'Failed saving role changes';
            this.httpService.reportAPICallFailure(error);
            this.spinnerService.hide();
          }
        });

    } catch (ex) {
      this.spinnerService.hide();
      console.log('Error saving role changes', ex);
      this.alertService.show(AlertSeverity.eError, 'Failed saving roles');
    }
  }

  onUpdateRoles_Success(response: boolean) {
    try {
      if (response) {
        this.applyRoleChangesOnUser();
      } else {
        console.log('Roles updation failed', response);
        this.alertService.show(AlertSeverity.eError, 'Failed saving Roles changes');
      }
    } catch (ex) {
      console.log('Error in Task Participants changes', ex);
      this.alertService.show(AlertSeverity.eError, 'Failed saving Task Participants');
    } finally {
      this.spinnerService.hide();
    }
  }

  applyRoleChangesOnUser() {
    this.user.Roles = this.rolesSelection.filter(sel => sel.Selected).map(sel => sel.Role);
    this.buildRoleSelection();
    console.log('Roles updated successfully');
    this.params.api.refreshCells({
      columns: ['RolesStr'], force: true
    });
    this.popupVisible = false;
  }

  onCloseClick() {
    try {
      this.popupVisible = false;
    } catch (ex) {
      console.log('Error closing', ex);
    }
  }

  onSelectionChange() {
    try {
      this.updateCount();
    } catch (ex) {
      console.log('Error selecting TP', ex);
      this.alertService.show(AlertSeverity.eError, 'Failed Selection/Unselecting Role');
    }
  }

  onClearAllClick() {
    try {
      this.rolesSelection.map(sel => sel.Selected = false);
      this.updateCount();
    } catch (ex) {
      console.log('Error clearing selection', ex);
      this.alertService.show(AlertSeverity.eError, 'Failed clearing Role selection');
    }
  }

}
