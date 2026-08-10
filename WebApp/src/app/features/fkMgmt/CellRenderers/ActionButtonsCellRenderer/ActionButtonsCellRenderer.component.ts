import { Component } from '@angular/core';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faArchway, faChartGantt, faFileImport } from '@fortawesome/free-solid-svg-icons';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { CommonFunctions } from 'src/app/utilities/CommonFunctions';
import { IActionButtonCellRendererRowData } from './ActionButtonCellRendererRowData';

@Component({
  selector: 'app-ActionButtonsCellRenderer',
  standalone: false,
  templateUrl: './ActionButtonsCellRenderer.component.html',
  styleUrls: ['./ActionButtonsCellRenderer.component.scss']
})
export class ActionButtonsCellRendererComponent implements ICellRendererAngularComp {
  
  dataImportIcon = faFileImport;
  deleteIcon = faTrashAlt;
  gateIcon = faArchway;
  planningIcon = faChartGantt;
  isDataImportActive = false;
  isDeleteActive = false;
  isPlanningActive = false;
  deleteConfirmationRequired = true;
  params!: ICellRendererParams<any, any, any>;
  rowData!: IActionButtonCellRendererRowData;

  agInit(params: ICellRendererParams<any, any, any>): void {
    try {
      this.params = params;
      this.rowData = params.node.data as IActionButtonCellRendererRowData;
      const dataImportFlag = (params as any)['dataImport'];
      if(CommonFunctions.isValid(dataImportFlag)) {
        this.isDataImportActive = dataImportFlag;
      }
      const deleteFlag = (params as any)['delete'];
      if(CommonFunctions.isValid(deleteFlag)) {
        this.isDeleteActive = deleteFlag;
      }
      const deleteConfirmationFlag = (params as any)['deleteConfirmationRequired'];
      if(CommonFunctions.isValid(deleteConfirmationFlag)) {
        this.deleteConfirmationRequired = deleteConfirmationFlag;
      }
      const planningFlag = (params as any)['planning'];
      if(CommonFunctions.isValid(planningFlag)) {
        this.isPlanningActive = planningFlag;
      }
      
    } catch (ex) {
      console.log('Error initialising Action buttons cell renderer', ex);
    }
  }
  refresh(params: ICellRendererParams<any, any, any>): boolean {
    try {
      
      return true;
    } catch (ex) {
      console.log('Error refreshing Action buttons cell renderer', ex);
      return false;
    }
  }

  onDataImportClick() {
    try {
      this.params.context.onDataImportClick(this.params.node);
    } catch (ex) {
      console.log('Error initialising data import', ex);
    }
  }

  onDeleteClick() {
    try {
      this.params.context.onDeleteClick(this.params.node.data);
    } catch (ex) {
      console.log('Error processing delete request', ex);
    }
  }

  onPlanningClick() {
    try {
      this.params.context.onPlanningClick(this.params.node.data);
    } catch (ex) {
      console.log('Error processing planning request', ex);
    }
  }

}
