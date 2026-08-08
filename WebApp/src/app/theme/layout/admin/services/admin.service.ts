import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CDrawerRequestData } from '../drawer-component';
import { faL } from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  
  private pageTitle = new BehaviorSubject<string>('');
  pageTitleObservable = this.pageTitle.asObservable();

  private drawerRequest = new BehaviorSubject<CDrawerRequestData>(null);
  drawerRequestObservable = this.drawerRequest.asObservable();

  private drawwerCloseRequest = new BehaviorSubject<boolean>(false);
  drawwerCloseRequestObservable = this.drawwerCloseRequest.asObservable();

  constructor() { }

  setPageTitle(title: string) {
    this.pageTitle.next(title);
  }

  openDrawer(requestInfo: CDrawerRequestData) {
    this.drawerRequest.next(requestInfo);
  }

  closeDrawer() {
    this.drawwerCloseRequest.next(true);
  }

  resetDrawer() {
    this.openDrawer(null);
    this.drawwerCloseRequest.next(false);
  }
}
