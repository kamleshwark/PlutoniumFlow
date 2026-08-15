// angular import
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-guest',
  standalone: false,
  templateUrl: './guest.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./guest.component.scss']
})
export class GuestComponent {}
