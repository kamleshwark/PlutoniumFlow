import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appDisableSwipeDrawer]',
  standalone: false,
  
})
export class DisableSwipeDrawerDirective {

  constructor(private el: ElementRef) { }

  @HostListener('swipeleft', ['$event'])
  onSwipeLeft(event: Event) {
    console.log('onSwipeLeft');
    
    // Prevent drawer from closing on left swipe
    event.stopPropagation();
  }

  @HostListener('swiperight', ['$event'])
  onSwipeRight(event: Event) {
    console.log('onSwipeLeft');
    // Prevent drawer from closing on right swipe
    event.stopPropagation();
  }

  

}
