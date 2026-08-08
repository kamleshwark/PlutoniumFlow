import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { ActionButtonsCellRendererComponent } from './CellRenderers/ActionButtonsCellRenderer/ActionButtonsCellRenderer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    NzPopconfirmModule 
  ],
  declarations: [
    ActionButtonsCellRendererComponent
  ]
})
export class FkMgmtModule { }
