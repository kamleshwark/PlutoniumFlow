import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorAndCompletionComponent } from './ColorAndCompletion/ColorAndCompletion.component';
import { NzProgressModule } from 'ng-zorro-antd/progress';

@NgModule({
  imports: [
    CommonModule,
    NzProgressModule
  ],
  declarations: [ColorAndCompletionComponent],
  exports: [ColorAndCompletionComponent]
})
export class ReusableComponentsModule { }
