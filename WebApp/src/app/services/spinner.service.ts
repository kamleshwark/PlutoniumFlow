import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Spinkit } from './../theme/shared/components/spinner/spinkits';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  private visible = new BehaviorSubject<boolean>(false);
  visibilityObservable = this.visible.asObservable();
  type = Spinkit.skCubeGrid;
  defaultType = Spinkit.skCubeGrid;

  constructor() { }

  show(type: any = undefined) {
    if (type) {
      this.type = type;
    } else {
      this.type = this.defaultType;
    }
    this.visible.next(true);
  }

  hide() {
    this.visible.next(false);
  }
}
