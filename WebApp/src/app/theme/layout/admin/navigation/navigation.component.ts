// angular import
import { Component, EventEmitter, Input, Output } from '@angular/core';

// project import
import { DattaConfig } from 'src/app/app-config';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  // public props
  @Output() NavCollapse = new EventEmitter();
  @Output() NavCollapsedMob = new EventEmitter();
  @Output() NavClosed = new EventEmitter();
  @Input() navCollapsed = false;
  navCollapsedMob = false;
  windowWidth = window.innerWidth;

  // constructor
  constructor() {
  }

  // public method
  navCollapse() {
    this.navCollapsed = !this.navCollapsed;
    this.NavCollapse.emit();
  }

  navCollapseMob() {
    if (this.windowWidth < 960) {
      this.NavCollapsedMob.emit();
    }
  }

  navClosed() {
    try {
      this.NavClosed.emit();
    } catch (ex) {
      console.log('Error closing menu', ex);
    }
  }
}
