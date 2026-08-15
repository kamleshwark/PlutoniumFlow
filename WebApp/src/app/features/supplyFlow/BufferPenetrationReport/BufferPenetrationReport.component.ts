import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CBPRRow } from 'src/app/models/BPRRow';
import { AlertService } from 'src/app/services/Alert.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { AdminService } from 'src/app/theme/layout/admin/services/admin.service';
import { AlertSeverity } from 'src/app/utilities/Alert';
import packageInfo from './../../../../../package.json';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { CommonModule } from '@angular/common';
import { StatusColor } from 'src/app/models/Enums.enum';
import Enumerable from 'linq';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAngleDown, faXmark } from '@fortawesome/free-solid-svg-icons';
import { CBPRPageSettings } from 'src/app/models/PageSettings/BPRPageSettings';
import { CommonFunctions } from 'src/app/utilities/CommonFunctions';

@Component({
  selector: 'app-BufferPenetrationReport',
  standalone: true,
  imports: [AgGridAngular, CommonModule, FontAwesomeModule],
  templateUrl: './BufferPenetrationReport.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./BufferPenetrationReport.component.scss']
})
export default class BufferPenetrationReportComponent implements OnInit {
  private adminService = inject(AdminService);
  private spinnerService = inject(SpinnerService);
  private http = inject(HttpClient);
  private alertService = inject(AlertService);

  bpr: any[] = [];
  agGridTheme = packageInfo['ag-grid-default-theme'];
  private gridApi!: GridApi<any>;
  gridOptions = {};
  techColorSummary: any[] = [];
  ecoColorSummary: any[] = [];
  availability = 0;
  blackRedSummary: Record<string, number> = {};

  closeColorSummaryIcon = faXmark;
  showColorSummaryIcon = faAngleDown;
  showingColorSummary = true;
  colorSummaryIcon: any;

  private readonly settingsStorageName = 'bpr-page-settings';

  constructor() {}

  ngOnInit() {
    try {
      this.adminService.setPageTitle('Buffer Penetration Report');
      this.setColorSummaryIcon();
      this.loadSampleData();
      this.createGridOptions();
    } catch (ex) {
      console.log('Error initialising Buffer Penetration Report Component', ex);
    }
  }

  readBPR(data: any[]) {
    this.bpr = CBPRRow.readFromAPIResult(data);
    this.bpr = Enumerable.from(this.bpr)
      .orderByDescending((b) => b.TechPenetration)
      .thenByDescending((b) => b.EcoPenetration)
      .toArray();

    this.makeColorSummary(this.bpr);
    this.restorePageSettings();
  }
  loadSampleData() {
    try {
      this.spinnerService.show();
      this.http.get<any[]>('assets/data/pharma_inventory.json').subscribe((data) => {
        this.readBPR(data);
      });
    } catch (ex) {
      console.log('Error loading BPR', ex);
      this.alertService.show(AlertSeverity.eError, 'Error loading BPR');
    } finally {
      this.spinnerService.hide();
    }
  }

  createGridOptions() {
    this.gridOptions = {
      context: this,
      defaultColDef: {
        sortable: true,
        autoHeaderHeight: true,
        wrapHeaderText: true
      },
      onSortChanged: (params: any) => {
        this.onSortChange(params);
      },
      onFilterChanged: (params: any) => {
        this.onFilterChange(params);
      },

      columnDefs: [
        {
          field: 'Sr.No',
          valueGetter: 'node.rowIndex + 1',
          headerName: 'Sr.No',
          width: '60',
          suppressSizeToFit: true,
          suppressCsvExport: true
        },
        {
          field: 'SKUCode',
          headerName: 'SKU Code',
          width: '200',
          filter: 'agTextColumnFilter',
          suppressSizeToFit: true
        },
        {
          field: 'LocationCode',
          headerName: 'Location Code',
          width: '200',
          filter: 'agTextColumnFilter',
          suppressSizeToFit: true
        },
        {
          field: 'Norm',
          headerName: 'Norm',
          width: '90',
          suppressSizeToFit: true,
          filter: 'agNumberColumnFilter',
          cellStyle: { textAlign: 'right' }
        },
        {
          field: 'Stock',
          headerName: 'Stock',
          width: '90',
          suppressSizeToFit: true,
          filter: 'agNumberColumnFilter',
          cellStyle: { textAlign: 'right' }
        },
        {
          field: 'GIT',
          headerName: 'GIT',
          width: '90',
          suppressSizeToFit: true,
          filter: 'agNumberColumnFilter',
          cellStyle: { textAlign: 'right' }
        },
        {
          field: 'TechPenetration',
          headerName: 'Tech. Pen.',
          width: '70',
          suppressSizeToFit: true,
          filter: 'agNumberColumnFilter',
          cellStyle: { textAlign: 'right' },
          valueFormatter: (params: any) => {
            return params.value == null ? '' : Number(params.value).toFixed(1);
          },
          cellClass: (params: any) => {
            try {
              const bprRow = params.data as CBPRRow;
              return 'cell-color-' + CBPRRow.getColor(bprRow.TechColor).toLowerCase();
            } catch (ex) {
              console.log('Error applying tech penetration color', ex);
              return '';
            }
          }
        },
        {
          field: 'EcoPenetration',
          headerName: 'Eco. Pen.',
          width: '70',
          suppressSizeToFit: true,
          filter: 'agNumberColumnFilter',
          cellStyle: { textAlign: 'right' },
          valueFormatter: (params: any) => {
            return params.value == null ? '' : Number(params.value).toFixed(1);
          },
          cellClass: (params: any) => {
            try {
              const bprRow = params.data as CBPRRow;
              return 'cell-color-' + CBPRRow.getColor(bprRow.EcoColor).toLowerCase();
            } catch (ex) {
              console.log('Error applying eco penetration color', ex);
              return '';
            }
          }
        },
        {
          field: 'SKUName',
          headerName: 'SKU Name',
          width: '200',
          filter: 'agTextColumnFilter',
          suppressSizeToFit: true
        },
        {
          field: 'LocationName',
          headerName: 'Location Name',
          width: '200',
          filter: 'agTextColumnFilter',
          suppressSizeToFit: true
        },
        {
          field: 'LocationArea',
          headerName: 'Location Area',
          width: '200',
          filter: 'agTextColumnFilter',
          suppressSizeToFit: true
        },
        {
          field: 'SKUType',
          headerName: 'SKU Type',
          width: '200',
          filter: 'agTextColumnFilter',
          suppressSizeToFit: true
        }
      ]
    };
  }

  onGridReady(gridReadyEvent: GridReadyEvent) {
    try {
      this.gridApi = gridReadyEvent.api;
    } catch (ex) {
      console.log('Error handling grid ready event', ex);
    }
  }

  onFilterChange(params: any) {
    try {
      params.api.refreshCells({ force: true, columns: ['Sr.No'] });

      const filteredRows: CBPRRow[] = [];
      this.gridApi.forEachNodeAfterFilter((node) => {
        filteredRows.push(node.data);
      });
      this.makeColorSummary(filteredRows);
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

  makeColorSummary(rows: CBPRRow[]) {
    const colorCodes = Object.values(StatusColor).filter((v): v is StatusColor => typeof v === 'number');
    this.techColorSummary = [];
    this.ecoColorSummary = [];
    const totalCount = rows.length;
    for (let i = colorCodes.length - 1; i > 0; i--) {
      const colorCode = colorCodes[i];
      const techColorCount = rows.filter((b) => colorCode === b.TechColor).length;
      const ecoColorCount = rows.filter((b) => colorCode === b.EcoColor).length;
      let techColorPerc = 0;
      let ecoColorPerc = 0;
      if (0 < totalCount) {
        techColorPerc = Number(((techColorCount / totalCount) * 100).toFixed(0));
        ecoColorPerc = Number(((ecoColorCount / totalCount) * 100).toFixed(0));
      }

      this.techColorSummary.push({ color: CBPRRow.getColor(colorCode), count: techColorCount, perc: techColorPerc });
      this.ecoColorSummary.push({ color: CBPRRow.getColor(colorCode), count: ecoColorCount, perc: ecoColorPerc });
    }

    this.availability = Number(CBPRRow.getAvailability(rows).toFixed(1));
    this.blackRedSummary['techBlackRedCount'] = rows.filter(
      (b) => StatusColor.eBlack === b.TechColor || StatusColor.eRed === b.TechColor
    ).length;
    this.blackRedSummary['ecoBlackRedCount'] = rows.filter(
      (b) => StatusColor.eBlack === b.EcoColor || StatusColor.eRed === b.EcoColor
    ).length;
    if (0 < totalCount) {
      this.blackRedSummary['techBlackRedPerc'] = Number(((this.blackRedSummary['techBlackRedCount'] / totalCount) * 100).toFixed(0));
      this.blackRedSummary['ecoBlackRedPerc'] = Number(((this.blackRedSummary['ecoBlackRedCount'] / totalCount) * 100).toFixed(0));
    }
  }

  onToggleDetails() {
    try {
      this.showingColorSummary = !this.showingColorSummary;
      this.setColorSummaryIcon();
      this.savePageSettings();
    } catch (ex) {
      console.log('Error toggling color summary', ex);
      this.alertService.show(AlertSeverity.eError, 'Failed toggling color summary');
    }
  }

  setColorSummaryIcon() {
    this.colorSummaryIcon = this.showingColorSummary ? this.closeColorSummaryIcon : this.showColorSummaryIcon;
  }

  savePageSettings() {
    const settings: CBPRPageSettings = {
      ShowingColorSummary: this.showingColorSummary
    };
    localStorage.setItem(this.settingsStorageName, JSON.stringify(settings));
  }

  restorePageSettings() {
    const storage = localStorage.getItem(this.settingsStorageName);
    if (CommonFunctions.isValid(storage)) {
      const strSettings = JSON.parse(storage!);
      const settings: CBPRPageSettings = Object.assign(new CBPRPageSettings(), strSettings);
      if (CommonFunctions.isValid(settings.ShowingColorSummary)) {
        this.showingColorSummary = settings.ShowingColorSummary;
      }
    }
    this.setColorSummaryIcon();
  }
}
