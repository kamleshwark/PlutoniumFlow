import { Component, ElementRef, inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { faFile } from '@fortawesome/free-regular-svg-icons';
import { faArrowRightToBracket, faArrowTurnDown, faArrowTurnUp, faGripVertical, faTableCells } from '@fortawesome/free-solid-svg-icons';
import { INoRowsOverlayAngularComp } from 'ag-grid-angular';
import { INoRowsOverlayParams } from 'ag-grid-community';
import { CommonFunctions } from 'src/app/utilities/CommonFunctions';


@Component({
  selector: 'app-ImportDataNoRowsOverlay',
  standalone: false,
  templateUrl: './ImportDataNoRowsOverlay.component.html',
  styleUrls: ['./ImportDataNoRowsOverlay.component.scss']
})
export class ImportDataNoRowsOverlayComponent implements INoRowsOverlayAngularComp  {

  private renderer = inject(Renderer2);
  @ViewChild('importDataButton', { static: false }) importDataButton!: ElementRef;
  public params!: INoRowsOverlayParams;
  importBtnCaption = 'Import Data';
  showImportBtnIcon = true;
  showImportButton = true;
  noRowsText = '';

  fileIcon = faFile;
  gridIcon = faGripVertical;
  downArrowIcon = faArrowTurnUp;

  constructor() { }
  agInit(params: INoRowsOverlayParams<any, any>): void {
    try {
      this.refresh!(params);
      const importBtnCaption = (params as any)['importBtnCaption'];
      if(!CommonFunctions.isStringNullOrEmpty(importBtnCaption)) {
        this.importBtnCaption = importBtnCaption;
      }
      const noRowsText = (params as any)['noRowsText'];
      if(!CommonFunctions.isStringNullOrEmpty(noRowsText)) {
        this.noRowsText = noRowsText;
      }
      const showImportBtnIcon = (params as any)['showImportBtnIcon'];
      if(CommonFunctions.isValid(showImportBtnIcon)) {
        this.showImportBtnIcon = showImportBtnIcon;
      }
      const showImportButton = (params as any)['showImportButton'];
      if(CommonFunctions.isValid(showImportButton)) {
        this.showImportButton = showImportButton;
      }
      setTimeout(() => {
        const button = this.importDataButton?.nativeElement;
        if (button) {
          button.addEventListener('click', () => {
            this.onImportDataClick();
          });
        }
      }, 0);

    } catch (ex) {
      console.log('Error initialising ImportDataNoRowsOverlayComponent', ex);
      
    }
    
  }
  refresh?(params: INoRowsOverlayParams<any, any>): void {
    try {
      this.params = params;
    } catch (ex) {
      console.log('Error refreshing ImportDataNoRowsOverlayComponent', ex);
    }
  }

  onImportDataClick() {
    try {
      this.params.context.onDataImportRequest();
    } catch (ex) {
      console.log('Error launching file import functionality', ex);
    }
    
  }


}
