import { Component, input, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { StatusColor } from 'src/app/models/Enums.enum';
import { CommonFunctions } from 'src/app/utilities/CommonFunctions';

@Component({
  selector: 'app-ColorAndCompletion',
  templateUrl: './ColorAndCompletion.component.html',
  styleUrls: ['./ColorAndCompletion.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None
})
export class ColorAndCompletionComponent implements OnInit, OnChanges {
  @Input() color: StatusColor;
  @Input() completion: number;
  @Input() strokeWidth = 10;
  @Input() width = 25;

  tooltip: string;
  colorClass: string;
  rgbColor: string;
  completionToShow: number;

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    try {
      if (changes['color']) {
        this.colorClass = this.getColorName(this.color);
        this.rgbColor = this.colorClass;
        if (StatusColor.eYellow === this.color) {
          this.rgbColor = '#FDDA0D';
        }
      }
      if (changes['completion']) {
        this.completionToShow = Math.floor(this.completion);
      }
      if (changes['color'] || changes['completion']) {
        this.setTooltip();
      }
    } catch (ex) {
      console.log('Error in ngOnChanges', ex);
    }
  }

  setTooltip() {
    const colorName = this.colorClass.charAt(0).toUpperCase() + this.colorClass.slice(1);
    this.tooltip = `Color - ${colorName}\nCompletion - ${CommonFunctions.convertTo2PlacesIfDecimal(this.completion)}%`;
  }
  getColorName(color: StatusColor) {
    let result = '';
    switch (color) {
      case StatusColor.eGreen:
        result = 'green';
        break;
      case StatusColor.eYellow:
        result = 'yellow';
        break;
      case StatusColor.eRed:
        result = 'red';
        break;
      case StatusColor.eBlack:
        result = 'black';
        break;
      case StatusColor.eWhite:
        result = 'white';
        break;
      default:
        result = 'white';
        break;
    }
    return result;
  }
}
