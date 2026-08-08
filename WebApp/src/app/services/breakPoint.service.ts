import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreakPointService {

  private currentBreakPoint = new BehaviorSubject<string>('');
  breakPointChangeObservable = this.currentBreakPoint.asObservable();

  constructor() { }

  reportBreakPointChange(newBreakPoint: string) {
    this.currentBreakPoint.next(newBreakPoint);
  }


}
