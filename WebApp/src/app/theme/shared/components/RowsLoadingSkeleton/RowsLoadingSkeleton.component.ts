import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-RowsLoadingSkeleton',
  templateUrl: './RowsLoadingSkeleton.component.html',
  styleUrls: ['./RowsLoadingSkeleton.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RowsLoadingSkeletonComponent implements OnInit {

  @Input() rowsCounnt = 10;
  rows = [];
  constructor() { }

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
