import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, inject, Input, OnInit, ViewChild, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import Enumerable from 'linq';
import { CBTGPoint, CBTGPointTEchEco as CBTGPointTechEco } from 'src/app/models/BTGPoint';
import { ColorType } from 'src/app/models/Enums.enum';
import { AlertService } from 'src/app/services/Alert.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { AdminService } from 'src/app/theme/layout/admin/services/admin.service';
import { AlertSeverity } from 'src/app/utilities/Alert';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { FormsModule } from '@angular/forms';
import { BufferTrendGraphCoreComponent } from './BufferTrendGraphCore/BufferTrendGraphCore.component';
import { CommonFunctions } from 'src/app/utilities/CommonFunctions';
import { NzSplitterModule } from 'ng-zorro-antd/splitter';

@Component({
  selector: 'app-BufferTrendGraph',
  standalone: true,
  imports: [NzSwitchModule, FormsModule, BufferTrendGraphCoreComponent, NzSplitterModule],
  templateUrl: './BufferTrendGraphMain.component.html',
  styleUrls: ['./BufferTrendGraphMain.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None
})
export default class BufferTrendGraphMainComponent implements OnInit {
  @ViewChild('techBTGComponent') techBTGComponent!: BufferTrendGraphCoreComponent;
  @ViewChild('ecoBTGComponent') ecoBTGComponent!: BufferTrendGraphCoreComponent;

  private adminService = inject(AdminService);
  private spinnerService = inject(SpinnerService);
  private http = inject(HttpClient);
  private alertService = inject(AlertService);

  btg: CBTGPointTechEco[] = [];
  techBTG: CBTGPoint[] = [];
  ecoBTG: CBTGPoint[] = [];
  isPercent = false;
  techBTGTitle = 'Technical Colors';
  ecoBTGTitle = 'Economical Colors';

  constructor() {}

  ngOnInit() {
    try {
      this.adminService.setPageTitle('Buffer Trend Graph');
      this.loadSampleData();
    } catch (ex) {
      console.log('Error initialising Buffer Trend Graph Component', ex);
    }
  }

  loadSampleData() {
    try {
      this.spinnerService.show();
      this.http.get<any[]>('assets/data/BufferTrendGraphData.json').subscribe((data) => {
        this.readBTG(data);
      });
    } catch (ex) {
      console.log('Error loading BTG', ex);
      this.alertService.show(AlertSeverity.eError, 'Error loading Buffer Trend Graph data');
    } finally {
      this.spinnerService.hide();
    }
  }

  readBTG(data: any[]) {
    this.btg = CBTGPointTechEco.readFromAPIResult(data);
    this.btg = Enumerable.from(this.btg)
      .orderBy((b) => b.ReportDate)
      .toArray();
    this.btg = this.btg.slice(-30);
    this.techBTG = this.btg.map((b) => CBTGPoint.getBTGPoint(b, ColorType.eTechnical));
    this.ecoBTG = this.btg.map((b) => CBTGPoint.getBTGPoint(b, ColorType.eEconimical));
    this.rebuildGraphs();
    // this.makeColorSummary(this.techBTG);
    // this.restorePageSettings();
  }

  rebuildGraphs() {
    if (CommonFunctions.isValid(this.techBTGComponent) && CommonFunctions.isValid(this.ecoBTGComponent)) {
      this.techBTGComponent.rebuild(this.techBTG, this.isPercent);
      this.ecoBTGComponent.rebuild(this.ecoBTG, this.isPercent);
    } else {
      setTimeout(() => {
        this.rebuildGraphs();
      }, 1000);
    }
  }

  countTypeChange(params: EventEmitter<boolean>) {
    try {
      console.log('isPercent', this.isPercent);
      this.rebuildGraphs();
    } catch (ex) {
      console.log('Error handlimg count type change', ex);
      this.alertService.show(AlertSeverity.eError, 'Failed handling count type change');
    }
  }
}
