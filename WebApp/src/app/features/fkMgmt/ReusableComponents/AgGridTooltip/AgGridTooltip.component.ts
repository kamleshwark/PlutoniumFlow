import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-AgGridTooltip',
  standalone: true,
  templateUrl: './AgGridTooltip.component.html',
  styleUrls: ['./AgGridTooltip.component.scss']
})
export class AgGridTooltipComponent {

  htmlContent: string;
  constructor() { }
  agInit(params: ICellRendererParams<any, any, any>): void {
    try {
      this.update(params);
    } catch (ex) {
      console.log('Error initialising Ag Grid Tooltip Component', ex);
    }
  }
  update(params: ICellRendererParams<any, any, any>) {
    this.htmlContent = params["htmlContent"];
  }

}
