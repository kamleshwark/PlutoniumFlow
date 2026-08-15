import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-TableLoadingSkeleton',
  standalone: false,
  templateUrl: './TableLoadingSkeleton.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./TableLoadingSkeleton.component.scss']
})
export class TableLoadingSkeletonComponent implements OnInit {
  @Input() rowCount = 4;
  @Input() colCount = 8;

  rows = [];
  cols = [];
  constructor() {}

  ngOnInit() {
    try {
      for (let i = 0; i < this.rowCount; i++) {
        this.rows.push(i);
      }
      for (let i = 0; i < this.colCount; i++) {
        this.cols.push(i);
      }
    } catch (ex) {
      console.log('Error initialising Table Loading Skeleton Component', ex);
    }
  }
}
