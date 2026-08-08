import { Component, Input, OnDestroy, Inject, ViewEncapsulation, input, inject, OnInit } from '@angular/core';
import { Spinkit } from './spinkits';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SpinnerComponent implements OnDestroy, OnInit {
  private spinnerService = inject(SpinnerService);
  public isSpinnerVisible = true;
  public Spinkit = Spinkit;
  @Input() public backgroundColor = '#1dc4e9';
  @Input() public spinner = Spinkit.skCubeGrid;
  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.router.events.subscribe({
      next: event => {
        if (event instanceof NavigationStart) {
          this.isSpinnerVisible = true;
        } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
          this.isSpinnerVisible = false;
        }
      },
      complete: () => {
        this.isSpinnerVisible = false;
      }
    }
    );

    // var duration = 1000;
    // var timeout = duration;

    // setTimeout(() => {
    //   this.spinner = Spinkit.skSpinningSquare;
    //   this.isSpinnerVisible = true;
    // }, 0);

    // setTimeout(() => {
    //   this.isSpinnerVisible = false;
    // }, 2000);

  }
  ngOnInit(): void {
    try {
      this.spinnerService.visibilityObservable.subscribe({
        next: status => {
          this.onSpinnerVisibilityChange(status);
        }
      });
    } catch (ex) {
      console.log('Error initialising Spinner', ex);

    }
  }

  onSpinnerVisibilityChange(status:boolean) {
    try {
      if(status) {
        this.spinner = this.spinnerService.type;
      }
      this.isSpinnerVisible = status;
    } catch (ex) {
      console.log('Error in changing spinner visibility', ex);
      
    }
  }
  ngOnDestroy(): void {
    try {
      this.isSpinnerVisible = false;
    } catch (ex) {
      console.log('Error destructing Spinner', ex);

    }
  }
}
