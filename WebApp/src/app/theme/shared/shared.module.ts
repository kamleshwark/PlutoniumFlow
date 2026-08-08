// angular import
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// project import
import { CardComponent } from './components/card/card.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { SpinnerComponent } from './components/spinner/spinner.component';

// bootstrap import
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

// third party
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AccordionModule } from 'primeng/accordion';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { ImportDataNoRowsOverlayComponent } from './components/ImportDataNoRowsOverlay/ImportDataNoRowsOverlay.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FloatLabelModule } from 'primeng/floatlabel';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { TableLoadingSkeletonComponent } from './components/TableLoadingSkeleton/TableLoadingSkeleton.component';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { RowsLoadingSkeletonComponent } from './components/RowsLoadingSkeleton/RowsLoadingSkeleton.component';

@NgModule({
  declarations: [
    SpinnerComponent,
    ImportDataNoRowsOverlayComponent,
    TableLoadingSkeletonComponent,
    RowsLoadingSkeletonComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    NgbModule,
    NgScrollbarModule,
    NgbCollapseModule,
    BreadcrumbsComponent,
    FontAwesomeModule,
    AccordionModule,
    NzProgressModule,
    AutoCompleteModule,
    FloatLabelModule,
    NzCollapseModule,
    NzPopconfirmModule,
    NzEmptyModule,
    NzSkeletonModule,
    NzSpaceModule,
    
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    SpinnerComponent,
    NgbModule,
    NgScrollbarModule,
    NgbCollapseModule,
    BreadcrumbsComponent,
    FontAwesomeModule,
    AccordionModule,
    NzProgressModule,
    AutoCompleteModule,
    NzCollapseModule,
    NzPopconfirmModule,
    NzEmptyModule,
    TableLoadingSkeletonComponent,
    RowsLoadingSkeletonComponent
  ]
})
export class SharedModule {}
