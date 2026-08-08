import { Component, Input, OnInit } from '@angular/core';
import { CBTGPoint } from 'src/app/models/BTGPoint';
import { AgChartOptions } from 'ag-charts-community';
import { CommonFunctions } from 'src/app/utilities/CommonFunctions';
import { clone } from 'lodash-es';
import { addDays, differenceInCalendarDays } from 'date-fns';
import { AgCharts } from 'ag-charts-angular';
import Enumerable from 'linq';

@Component({
  selector: 'app-BufferTrendGraphCore',
  standalone: true,
  imports: [AgCharts],
  templateUrl: './BufferTrendGraphCore.component.html',
  styleUrls: ['./BufferTrendGraphCore.component.scss']
})
export class BufferTrendGraphCoreComponent implements OnInit {

  @Input() title = '<title>';
  @Input() btgData: CBTGPoint[] = [];

  chartOptions!: AgChartOptions;
  isPercent = false;

  constructor() { }

  ngOnInit() {
    try {
      this.buildChartOptions();
    } catch (ex) {
      console.log('Error initialising Buffer Trend Graph Core Component', ex);

    }
  }

  buildChartOptions() {
    const lineMarkerSize = 2;
    const highlightStrokeWidth = 3;
    this.chartOptions = {
      title: {
        text: this.title,
        color: 'grey',
        fontSize: 12
      },
      legend: {
        enabled: true,
      },
      tooltip: {
        range: 2,
      },
      series: [
        {
          type: "line",
          xKey: "ReportDate",
          yKey: "TechWhite",
          yName: "White",
          stroke: 'grey',
          marker: {
            size: lineMarkerSize,
            fill: 'grey'
          },
          tooltip: {
            renderer: (params) => this.getTooltip(params),
            interaction: {
              enabled: true
            }
          },
          highlightStyle: {
            item: {
              strokeWidth: highlightStrokeWidth,
              stroke: 'grey'
            }
          }
        },
        {
          type: "line",
          xKey: "ReportDate",
          yKey: "TechGreen",
          yName: "Green",
          stroke: 'green',
          marker: {
            size: lineMarkerSize,
            fill: 'green'
          },
          tooltip: {
            renderer: (params) => this.getTooltip(params),
            interaction: {
              enabled: true
            }
          },
          highlightStyle: {
            item: {
              strokeWidth: highlightStrokeWidth,
              stroke: 'green'
            }
          }
        },
        {
          type: "line",
          xKey: "ReportDate",
          yKey: "TechYellow",
          yName: "Yellow",
          stroke: '#ffd000',
          marker: {
            size: lineMarkerSize,
            fill: '#ffd000'
          },
          tooltip: {
            renderer: (params) => this.getTooltip(params),
            interaction: {
              enabled: true
            }
          },
          highlightStyle: {
            item: {
              strokeWidth: highlightStrokeWidth,
              stroke: '#ffd000'
            }
          }
        },
        {
          type: "line",
          xKey: "ReportDate",
          yKey: "TechRed",
          yName: "Red",
          stroke: 'red',
          marker: {
            size: lineMarkerSize,
            fill: 'red'
          },
          tooltip: {
            renderer: (params) => this.getTooltip(params),
            interaction: {
              enabled: true
            }
          },
          highlightStyle: {
            item: {
              strokeWidth: highlightStrokeWidth,
              stroke: 'red'
            }
          }
        },
        {
          type: "line",
          xKey: "ReportDate",
          yKey: "TechBlack",
          yName: "Black",
          stroke: 'black',
          marker: {
            size: lineMarkerSize,
            fill: 'black'
          },
          tooltip: {
            renderer: (params) => this.getTooltip(params),
            interaction: {
              enabled: true
            }
          },
          highlightStyle: {
            item: {
              strokeWidth: highlightStrokeWidth,
              stroke: 'black'
            }
          }
        },
        {
          type: "line",
          xKey: "ReportDate",
          yKey: "Total",
          yName: "Total",
          stroke: 'blue',
          visible: false,
          marker: {
            size: lineMarkerSize,
            fill: 'blue'
          },
          tooltip: {
            renderer: (params) => this.getTooltip(params),
            interaction: {
              enabled: true
            }
          },
          highlightStyle: {
            item: {
              strokeWidth: highlightStrokeWidth,
              stroke: 'blue'
            }
          }
        },
      ],
      axes: [
        {
          type: 'time',
          position: 'bottom',
          label: {
            rotation: -60,
            avoidCollisions: true
          },
          nice: false,
        },
        {
          type: 'number',
          position: 'left',
          line: {
            enabled: true,
            stroke: '#CCC',

          },
        },
      ],
    };
  }

  builGraph() {
    if (CommonFunctions.isValid(this.btgData) && CommonFunctions.isValid(this.chartOptions)) {
      const xAxis = (this.chartOptions as any).axes[0];
      const xAxisLabel = xAxis.label;
      xAxisLabel.format = this.getXAxisRange() < 90 ? '%d-%b' : '%b-%y';

      const tickCount = 30;
      let interval = Math.ceil(this.getXAxisRange()/tickCount);
      if (1>interval){
        interval = 1;
      }
      const dates = [];
      for (let i = 0; i < tickCount; i++) {
        dates.push(addDays(this.btgData[0].ReportDate, i*interval));
      }

      xAxis.interval = {values: dates};

      const yAxis = (this.chartOptions as any).axes[1];
      if (this.isPercent) {
        yAxis.interval = { step: 10 };
      } else {
        const maxTotalObj = Enumerable.from(this.btgData).maxBy(b => b.Total);
        yAxis.interval = { step: Math.round(maxTotalObj.Total / 10) };
      }
      const options = clone(this.chartOptions);
      options.data = this.buildData();
      this.chartOptions = options;
    } 
  }

  rebuild(btgData: CBTGPoint[], isPercent: boolean) {
    this.btgData = btgData;
    this.isPercent = isPercent;
    this.builGraph();
  }

  getXAxisRange(): number {
    let result = 0;
    if (CommonFunctions.isValid(this.btgData) && 0 < this.btgData.length) {
      const startDate = this.btgData[0].ReportDate;
      const lastDate = this.btgData.at(-1)?.ReportDate;
      result = differenceInCalendarDays(lastDate!, startDate);
    }
    return result;
  }

  buildData(): any[] {
    const progressPoints: any[] = [];

    this.btgData.forEach(b => {
      let white = b.White;
      let green = b.Green;
      let yellow = b.Yellow;
      let red = b.Red;
      let black = b.Black;
      let total = b.Total;
      if (this.isPercent) {
        white = b.WhitePercent;
        green = b.GreenPercent;
        yellow = b.YellowPercent;
        red = b.RedPercent;
        black = b.BlackPercent;
        total = 100;
      }
      progressPoints.push({
        ReportDate: b.ReportDate,
        TechWhite: white,
        TechGreen: green,
        TechYellow: yellow,
        TechRed: red,
        TechBlack: black,
        Total: total,
        progressObject: b
      });
    });
    return progressPoints;
  }

  getTooltip(params: any): string {
    try {
      const point: CBTGPoint = params.datum.progressObject;
      return point.getTooltip();
    } catch (ex) {
      console.log('Error generation info', ex);
      return 'error';
    }
  }

}
