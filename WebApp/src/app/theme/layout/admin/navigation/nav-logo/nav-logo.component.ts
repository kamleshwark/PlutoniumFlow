// angular import
import { Component, EventEmitter, Input, Output } from '@angular/core';
import packageInfo from '../../../../../../../package.json';
import { faLock, faThumbTack, faThumbTackSlash, faUnlock, faXmark } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-nav-logo',
  standalone: false,
  templateUrl: './nav-logo.component.html',
  styleUrls: ['./nav-logo.component.scss']
})
export class NavLogoComponent {
  // public props
  title = packageInfo.title;
  @Input() navCollapsed!: boolean;
  @Output() NavCollapse = new EventEmitter();
  @Output() NavClosed = new EventEmitter();
  windowWidth = window.innerWidth;
  closeIcon = faXmark;
  minimizeIcon = faThumbTackSlash;
  maximizeIcon = faThumbTack;

  // public method
  navCollapse() {
    this.navCollapsed = !this.navCollapsed;
    this.NavCollapse.emit();
  }

  navClosed() {
    try {
      this.NavClosed.emit();
    } catch (ex) {
      console.log('Error closing menu', ex);
    }
  }
}
