import { Component, Input, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-RowsLoadingSkeleton',
  standalone: false,
  templateUrl: './RowsLoadingSkeleton.component.html',
  styleUrls: ['./RowsLoadingSkeleton.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None
})
export class RowsLoadingSkeletonComponent implements OnInit {
  @Input() rowsCounnt = 10;
  rows: number[] = [];
  constructor() {}

  ngOnInit() {
    try {
      for (let i = 0; i < this.rowsCounnt; i++) {
        this.rows.push(i);
      }
    } catch (ex) {
      console.log('Error initialising Rows Loading Skeleton Component', ex);
    }
  }
}
