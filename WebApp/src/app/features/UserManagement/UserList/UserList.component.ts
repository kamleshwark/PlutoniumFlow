import { Component, inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { AdminService } from 'src/app/theme/layout/admin/services/admin.service';
import packageInfo from './../../../../../package.json';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { CommonModule } from '@angular/common';
import { HttpService } from 'src/app/services/http.service';
import { AlertService } from 'src/app/services/Alert.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { retry, Subscription, tap } from 'rxjs';
import { AlertSeverity } from 'src/app/utilities/Alert';
import { CUser, CUserForAddEdit } from 'src/app/models/User';
import { AgGridTooltipComponent } from '../../fkMgmt/ReusableComponents/AgGridTooltip/AgGridTooltip.component';
import { CommonFunctions } from 'src/app/utilities/CommonFunctions';
import { MultiSelectColumnFilterComponent } from '../../fkMgmt/ReusableComponents/MultiSelectColumnFilter/MultiSelectColumnFilter.component';
import Enumerable from 'linq';
import { UserService } from 'src/app/services/user.service';
import { RoleSetterCellRendererComponent } from '../RoleSetterCellRenderer/RoleSetterCellRenderer.component';
import { ComponentsPreloadingService } from 'src/app/services/componentsPreloading.service';
import { PreloadableComponent } from 'src/app/models/Enums.enum';
import { CDrawerRequestData, DrawerComponent } from 'src/app/theme/layout/admin/drawer-component';
import { ActionButtonsCellRendererComponent } from '../../fkMgmt/CellRenderers/ActionButtonsCellRenderer/ActionButtonsCellRenderer.component';
import { EditableTextCellRendererComponent } from '../../fkMgmt/CellRenderers/EditableTextCellRenderer/EditableTextCellRenderer.component';
import { UserActionsCellRendererComponent } from '../UserActionsCellRenderer/UserActionsCellRenderer.component';

@Component({
  selector: 'app-UserList',
  standalone: true,
  imports: [AgGridAngular, CommonModule],
  templateUrl: './UserList.component.html',
  styleUrls: ['./UserList.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export default class UserListComponent implements OnInit, OnDestroy {

  private adminService = inject(AdminService);
  private httpService = inject(HttpService);
  private alertService = inject(AlertService);
  private spinnerService = inject(SpinnerService);
  private userService = inject(UserService);
  private componentsPreloadingService = inject(ComponentsPreloadingService);

  users!: CUserForAddEdit[];
  agGridTheme = packageInfo['ag-grid-default-theme'];
  private gridApi!: GridApi<any>;
  gridOptions = {};
  private subs:Subscription[] = [];
  
  constructor() { }

  ngOnInit() {
    try {
      this.componentsPreloadingService.load(PreloadableComponent.eNewUserDrawer);
      this.adminService.setPageTitle('User Management');
      this.loadUsers();
      this.createGridOptions();
      const sub = this.userService.newUserObservable.subscribe((data) => {
        this.onNewUseraded(data);
      });
      this.subs.push(sub);
    } catch (ex) {
      console.log('Error initialising User List Component', ex);

    }
  }

  ngOnDestroy(): void {
    try {
      this.subs.map(sub => sub.unsubscribe());
    } catch (ex) {
      console.log('Error destroying User List Component');
    }
  }

  onNewUseraded(newUser: CUserForAddEdit) {
    try {
      if (CommonFunctions.isValid(newUser)) {
        this.users.push(newUser);
        this.gridApi.applyTransaction({ add: [newUser] });
      }

    } catch (ex) {
      console.log('Error adding new user in the list');
    }
  }

  onFilterChange(params: any) {
    try {
      params.api.refreshCells({ force: true, columns: ['Sr.No'] });
    } catch (ex) {
      console.log('Error handling filter change', ex);
    }
  }

  onSortChange(params: any) {
    try {
      params.api.refreshCells({ force: true, columns: ['Sr.No'] });
    } catch (ex) {
      console.log('Error handling sorting change', ex);
    }
  }

  createGridOptions() {
    this.gridOptions = {
      context: this,
      defaultColDef: {
        sortable: false,
        autoHeaderHeight: true,
        wrapHeaderText: true
      },
      onSortChanged: (params: any) => {
        this.onSortChange(params);
      },
      onFilterChanged: (params: any) => {
        this.onFilterChange(params);
      },
      onCellValueChanged: (event: any) => {
        this.onCellValueChanged(event);
      },
      columnDefs: [
        {
          cellRenderer: ActionButtonsCellRendererComponent,
          cellRendererParams: { delete: true, context: this },
          width: "50", suppressSizeToFit: true,
        },
        {
          cellRenderer: UserActionsCellRendererComponent,
          width: "50", suppressSizeToFit: true,
        },
        { field: "Sr.No", valueGetter: "node.rowIndex + 1", headerName: "Sr.No", width: "60", suppressSizeToFit: true, suppressCsvExport: true },
        {
          field: "Id", headerName: "id", width: "100", suppressSizeToFit: true,
          sortable: true,
        },
        {
          field: "Username", headerName: "User Name", width: "200", filter: 'agTextColumnFilter', suppressSizeToFit: true,
          sortable: true,
        },
        {
          field: "FullName", headerName: "Full Name", width: "200", filter: 'agTextColumnFilter', suppressSizeToFit: true,
          sortable: true,
          cellRenderer: EditableTextCellRendererComponent,
          editable: (params: any) => {
            try {
              const user: CUserForAddEdit = params.data;
              return !user.FullNameSaveInProgress;
            } catch (ex) {
              console.log('Error detecting editable property of full name', ex);
            }
            return false;
          }, 
          singleClickEdit: true,
          tooltipField: 'FullNameTooltip',
          cellClass: (params: any) => {
            let cls = '';
            try {
              const user: CUserForAddEdit = params.data;
              if(user.FullNameSaveInProgress) {
                cls ='data-saving';
              } else if(!user.isFullNameValid()) {
                cls ='erroneous-cell';
              }
              
            } catch (ex) {
              console.log('Error setting cell class for full name');
            }
            return cls;
          },
        },
        {
          field: "EMail", headerName: "Email", width: "200", filter: 'agTextColumnFilter', suppressSizeToFit: true,
          sortable: true,
          cellRenderer: EditableTextCellRendererComponent,
          editable: (params: any) => {
            try {
              const user: CUserForAddEdit = params.data;
              return !user.EmailSaveInProgress;
            } catch (ex) {
              console.log('Error detecting editable property of email', ex);
            }
            return false;
          }, 
          singleClickEdit: true,
          tooltipField: 'EmailTooltip',
          cellClass: (params: any) => {
            let cls = '';
            try {
              const user: CUserForAddEdit = params.data;
              if(user.EmailSaveInProgress) {
                cls ='data-saving';
              } else if(!user.isEmailValid()) {
                cls ='erroneous-cell';
              }
              
            } catch (ex) {
              console.log('Error setting cell class for email');
            }
            return cls;
          },
        },
        {
          field: "RolesStr", headerName: "Roles", width: "300", suppressSizeToFit: true,
          cellRenderer: RoleSetterCellRendererComponent, 
          tooltipValueGetter: () => "dummy text",//tooltip wont show up if this is blank
          tooltipComponent: AgGridTooltipComponent,
          tooltipComponentParams: (params: any) => {
            let result: string = '';
            try {
              const user: CUserForAddEdit = params.data;
              if (CommonFunctions.isValid(user.Roles)) {
                result = user.RolesTooltip;
              }
            } catch (ex) {
              console.log('Error getting roles tooltip', ex);
            }
            return { htmlContent: result };
          },
          filter: MultiSelectColumnFilterComponent,
          filterParams: {
            options: this.userService.getRolesColumFilterOptions(),
            filterFunction: 'RoleColumnFilter'
          }
        },
      ],
    }
  }

  onCellValueChanged(event: any) {
    try {
      const user = event.data as CUserForAddEdit;
      if ('FullName' === event.column.colId) {
        if (user.isFullNameValid()) {
          user.OldFullName = event.oldValue;
          this.saveFullNameChange(user);
        }
      } else if ('EMail' === event.column.colId) {
        if (user.isEmailValid()) {
          user.OldEMail = event.oldValue;
          this.saveEmailChange(user);
        }
      }
    } catch (ex) {
      console.log('Error handling cell value change', ex);
    }
  }

  saveFullNameChange(user: CUserForAddEdit) {
    if(CommonFunctions.isStringNullOrEmpty(user.FullName)){
      user.FullName = '';
    }
    
    user.FullName = user.FullName.trim();
    this.changeFullNameSavingStatus(user, true);
    
    let attemptNo = 1;
    this.httpService.put('users/ModifyUser', { Id: user.Id, fullName: user.FullName})
      .pipe(
        tap({
          error: (err) => {
            console.log(`Attempt No. ${attemptNo++} failed`, err);
          },
        }),
        retry({ count: 10, delay: this.httpService.retryDelay }),
      )
      .subscribe({
        next: (data) => {
          this.onUpdateFullName_Success(user, data);
        },
        error: (error) => {
          user.FullName = user.OldFullName;
          this.changeFullNameSavingStatus(user, false);
          error.context = 'Failed saving Full name';
          this.httpService.reportAPICallFailure(error);
        }
      });
  }

  onUpdateFullName_Success(user: CUserForAddEdit, response: any) {
    try {
      if (true === response) {
        console.log('Full name updated successfully');
      } else {
        console.log('Full name updation failed');
      }

    } catch (ex) {
      console.log('Failed saving Full name change', ex);
    } finally {
      this.changeFullNameSavingStatus(user, false);
    }
  }

  changeFullNameSavingStatus(user: CUserForAddEdit, savingInProgress: boolean) {
    user.FullNameSaveInProgress = savingInProgress;
    this.gridApi.refreshCells({
      columns: ['FullName'], force: true
    });
  }

  saveEmailChange(user: CUserForAddEdit) {
    if(CommonFunctions.isStringNullOrEmpty(user.EMail)){
      user.EMail = '';
    }
    
    user.EMail = user.EMail.trim();
    this.changeEmailSavingStatus(user, true);
    
    let attemptNo = 1;
    this.httpService.put('users/ModifyUser', { Id: user.Id, email: user.EMail})
      .pipe(
        tap({
          error: (err) => {
            console.log(`Attempt No. ${attemptNo++} failed`, err);
          },
        }),
        retry({ count: 10, delay: this.httpService.retryDelay }),
      )
      .subscribe({
        next: (data) => {
          this.onUpdateEmail_Success(user, data);
        },
        error: (error) => {
          user.EMail = user.OldEMail;
          this.changeEmailSavingStatus(user, false);
          error.context = 'Failed saving Email';
          this.httpService.reportAPICallFailure(error);
        }
      });
  }

  onUpdateEmail_Success(user: CUserForAddEdit, response: any) {
    try {
      if (true === response) {
        console.log('Email updated successfully');
      } else {
        console.log('Email updation failed');
      }

    } catch (ex) {
      console.log('Failed saving Email change', ex);
    } finally {
      this.changeEmailSavingStatus(user, false);
    }
  }

  changeEmailSavingStatus(user: CUserForAddEdit, savingInProgress: boolean) {
    user.EmailSaveInProgress = savingInProgress;
    this.gridApi.refreshCells({
      columns: ['EMail'], force: true
    });
  }

  RoleColumnFilter(row: CUser, selectedValues: string[]) {
    const present = Enumerable.from(selectedValues)
      .join(row.Roles,
        sel => sel,
        role => role,
        (sel: string, role: string) => {
          return role
        }
      ).toArray().length > 0;
    return present;
  }

  onGridReady(gridReadyEvent: GridReadyEvent) {
    try {
      this.gridApi = gridReadyEvent.api;
    } catch (ex) {
      console.log('Error handling grid ready event', ex);
    }
  }

  getRowClass(params: any) {

    let cls = '';
    try {

    } catch (ex) {
      console.log('Error in getRowClass', ex);
    }


    return cls;
  };

  loadUsers() {
    this.spinnerService.show();
    let attemptNo = 1;
    this.httpService.get('users/all')
      .pipe(
        tap({
          error: (err) => {
            console.log(`Attempt No. ${attemptNo++} failed`, err);
          },
        }),
        retry({ count: 10, delay: this.httpService.retryDelay }),
      )
      .subscribe({
        next: (data) => {
          this.onAll_Success(data);
        },
        error: (error) => {
          error.context = 'Failed loading users';
          this.httpService.reportAPICallFailure(error);
          this.spinnerService.hide();
        }
      });
  }

  onAll_Success(response: any) {
    try {
      this.users = CUserForAddEdit.readFromAPIResult(response) as CUserForAddEdit[];
    } catch (ex) {
      console.log('Error loading users', ex);
      this.alertService.show(AlertSeverity.eError, 'Failed loading users');
    } finally {
      this.spinnerService.hide();
    }
  }

  onNewUserClick() {
    try {
      this.alertService.closeAll();
      const drawerInfo: CDrawerRequestData = {
        Component: DrawerComponent.eNewUserDrawer,
        Class: 'offset-lg-6 col-lg-6 offset-md-4 col-md-8 col-sm-12',
        Data: {  }
      }
      this.adminService.openDrawer(drawerInfo);
    } catch (ex) {
      console.log('Error launching new user screen', ex);
      this.alertService.show(AlertSeverity.eError, 'Failed launching new user creation screen');
    }
  }

  onDeleteClick(user: CUserForAddEdit) {
    try {
      this.alertService.closeAll();
      this.spinnerService.show();

      this.httpService.delete('users/delete/' + user.Id)
        .subscribe({
          next: (data) => {
            this.onDelete_Success(data, user);
          },
          error: (error) => {
            error.context = 'Failed deleting user';
            this.httpService.reportAPICallFailure(error);
            this.spinnerService.hide();
          }
        });

    } catch (ex) {
      console.log('Error deleting user', ex);
      this.spinnerService.hide();
    }

  }

  onDelete_Success(response: any, user: CUserForAddEdit) {
    try {
      if (true === response) {
        CommonFunctions.removeItem(this.users, user);
        this.gridApi.applyTransaction({ remove: [user] });
        this.alertService.show(AlertSeverity.eSuccess, 'User deleted successfully');
      } else {
        this.alertService.show(AlertSeverity.eError, 'Failed deleting user');
      }
    } catch (ex) {
      console.log('Error deleting user', ex);
      this.alertService.show(AlertSeverity.eError, 'Failed deleting user');
    } finally {
      this.spinnerService.hide();
    }
  }

}
