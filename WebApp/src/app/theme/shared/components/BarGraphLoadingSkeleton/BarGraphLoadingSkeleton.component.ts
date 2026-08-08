import { Component, input, Input, OnInit } from '@angular/core';
import Enumerable from 'linq';
import { CommonFunctions } from 'src/app/utilities/CommonFunctions';

@Component({
  selector: 'app-BarGraphLoadingSkeleton',
  standalone: true,
  imports: [],
  templateUrl: './BarGraphLoadingSkeleton.component.html',
  styleUrls: ['./BarGraphLoadingSkeleton.component.scss']
})
export class BarGraphLoadingSkeletonComponent implements OnInit {

  @Input() barCount = 8;
  @Input() title: string;
  @Input() subtitle: string;
  @Input() sort = BarSortingOrder.eNone;

  commonFunctions = CommonFunctions;

  readonly MAX_HEIGHT = 10;
  bars = [];
  constructor() { }

  ngOnInit() {
    try {
      let vals = [];
      for (let i = 0; i < this.barCount; i++) {
        const val =  Math.floor(Math.random() * (this.MAX_HEIGHT - 1 + 1)) + 1;
        vals.push(val);
      }
      vals = this.sortBars(vals);
      
      for (let i = 0; i < this.MAX_HEIGHT; i++) {
        const bar: boolean[] = [];
        for (let j = 0; j < this.barCount; j++) {
          const val = vals[j];
          bar.push(this.MAX_HEIGHT-val <= i)
        }
        this.bars.push(bar);
      }
    } catch (ex) {
      console.log('Error initialising Bar Graph Loading Skeleton Component', ex);

    }
  }

  sortBars(vals: number[]): number[] {
    switch (this.sort) {
      case BarSortingOrder.eAscending:
        vals = Enumerable.from(vals).orderBy(v => v).toArray();
        break;
      case BarSortingOrder.eDescending:
        vals = Enumerable.from(vals).orderByDescending(v => v).toArray();
        break;

      default:
        break;
    }

    return vals;
  }

}

export enum BarSortingOrder {
  eNone = 0,
  eAscending,
  eDescending
}
