import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { EditableCallbackParams, ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-EditableTextCellRenderer',
  standalone: true,
  imports:[ FontAwesomeModule],
  templateUrl: './EditableTextCellRenderer.component.html',
  styleUrls: ['./EditableTextCellRenderer.component.scss']
})
export class EditableTextCellRendererComponent implements ICellRendererAngularComp {

  faEdit = faPencil;
  text:string = '';
  isCellEditable: any;
  
  constructor() { }
  agInit(params: ICellRendererParams<any, any, any>): void {
    try {
      this.update(params);
    } catch (ex) {
      console.log('Error initialising Editable text Cell Renderer Component');
    }
  }
  refresh(params: ICellRendererParams<any, any, any>): boolean {
    try {
      this.update(params);
    } catch (ex) {
      console.log('Error refreshing Editable Text Cell Renderer Component', ex);
      return false;  
    }
    return true;
  }

  update(params: ICellRendererParams<any, any, any>) {
    const editableParams = {
      ...params,
      column: params.column
    };
    this.isCellEditable = ('function' === typeof params.colDef!.editable)
      ? params.colDef!.editable(editableParams as EditableCallbackParams)
      : params.colDef!.editable;
    this.text = params.value;
  }

}
