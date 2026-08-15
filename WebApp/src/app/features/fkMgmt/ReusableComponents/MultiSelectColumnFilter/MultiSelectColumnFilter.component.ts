import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IFilterAngularComp } from 'ag-grid-angular';
import { AgPromise, IDoesFilterPassParams, IFilterParams } from 'ag-grid-community';
import { CGridColumnFilterOption } from 'src/app/models/GridColumnFilterOption';
import { CommonFunctions } from 'src/app/utilities/CommonFunctions';

@Component({
  selector: 'app-MultiSelectColumnFilter',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './MultiSelectColumnFilter.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./MultiSelectColumnFilter.component.scss']
})
export class MultiSelectColumnFilterComponent implements IFilterAngularComp {
  private params!: IFilterParams;

  filterOptions: CGridColumnFilterOption[] = [];
  filterFunction: string;

  constructor() {}
  agInit(params: IFilterParams<any, any>): void {
    try {
      this.params = params;
      this.filterOptions = this.params['options'];
      this.filterFunction = this.params['filterFunction'];

      if (!CommonFunctions.isValid(this.filterOptions)) {
        console.error(`Filter options not defined`);
      }
      const context = this.params.context;
      if (CommonFunctions.isStringNullOrEmpty(this.filterFunction)) {
        console.error(`Filter function not specified in filterParams`);
      } else {
        if (!context || !this.filterFunction || typeof context[this.filterFunction] !== 'function') {
          console.error(`Filter function '${this.filterFunction}' for column '${this.params.column['colId']}' not found on parent`);
        }
      }
    } catch (ex) {
      console.log('Error initialising Task Status Filter Component', ex);
    }
  }
  isFilterActive(): boolean {
    try {
      return this.filterOptions.some((o) => !o.isSelected);
    } catch (ex) {
      console.log('Error detecting isFilterActive', ex);
      return false;
    }
  }
  getModel() {}
  setModel(model: any): void | AgPromise<void> {}
  doesFilterPass(params: IDoesFilterPassParams): boolean {
    try {
      const context = this.params.context;
      if (!context || !this.filterFunction || typeof context[this.filterFunction] !== 'function') {
        console.error(`Filetring cannot work as filter function not available`);
        return true;
      }
      const selectedValues = this.filterOptions.filter((o) => o.isSelected).map((o) => o.Value);

      return context[this.filterFunction](params.data, selectedValues);
    } catch (ex) {
      console.log('Error in doesFilterPass of Task Status Filter Component', ex);
      return false;
    }
  }

  onSelectionChange() {
    try {
      const noneSelected = !this.filterOptions.some((o) => o.isSelected);
      if (noneSelected) {
        setTimeout(() => {
          this.filterOptions.map((o) => (o.isSelected = true));
          this.params.filterChangedCallback();
        });
      } else {
        this.params.filterChangedCallback();
      }
    } catch (ex) {
      console.log('Error selecting status', ex);
    }
  }
}
