import { Component, ComponentRef, inject, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { DrawerComponent } from '../drawer-component';
import { CommonFunctions } from 'src/app/utilities/CommonFunctions';
import { ComponentsPreloadingService } from 'src/app/services/componentsPreloading.service';
import { PreloadableComponent } from 'src/app/models/Enums.enum';

@Component({
  selector: 'app-DrawerContainer',
  standalone: false,
  templateUrl: './DrawerContainer.component.html',
  styleUrls: ['./DrawerContainer.component.scss']
})
export class DrawerContainerComponent implements OnInit, OnChanges {

  @ViewChild('lazyContainer', { read: ViewContainerRef })
  lazyContainer!: ViewContainerRef;
  private componentRef?: ComponentRef<any>;

  private componentsPreloadingService = inject(ComponentsPreloadingService);

  
  @Input() drawerComponent = DrawerComponent.eNone;
  @Input() data:any;

  DrawerComponent = DrawerComponent;
  drawerComponentAvailable = false;
  constructor() { }
  
  ngOnChanges(changes: SimpleChanges): void {
    try {
      if(changes['drawerComponent']) {
        this.loadLazyComponent();
      }
    } catch (ex) {
      console.log('Error in ngOnChanges of Drawer Container Component', ex);
    }
  }

  ngOnInit() {
  }

  async loadLazyComponent() {
    try {
      const startTime = new Date();
      let componentId = PreloadableComponent.eNone;

      switch (this.drawerComponent) {
        case DrawerComponent.eProjectAddEditDrawer:
          componentId = PreloadableComponent.eProjectAddEditDrawer;  
          break;
        case DrawerComponent.eNewUserDrawer:
          componentId = PreloadableComponent.eNewUserDrawer;
          break;
      }
      if (PreloadableComponent.eNone != componentId) {
        this.loadComponent(componentId, startTime);
      }
      
    } catch (ex) {
      console.log('Error lazy loading drawer component', ex);
    }
  }

  loadComponent(componentId: PreloadableComponent, startTime: Date) {
    const component = this.componentsPreloadingService.getComponent(componentId);
    if (CommonFunctions.isValid(component)) {
      console.log(componentId + ' is available');
      this.drawerComponentAvailable = true;
      this.lazyContainer.clear();
      const component = this.componentsPreloadingService.getComponent(componentId);

      this.componentRef = this.lazyContainer.createComponent(component);
      this.componentRef.instance.data = this.data;
      const finishTime = new Date();
      console.log('Drawer Loading time (ms)', finishTime.getTime() - startTime.getTime());
    } else {
      console.log(componentId + ' is not avilable yet. Waiting...');
      
      setTimeout(() => {
        this.loadComponent(componentId, startTime);
      }, 1000);
    }
  }

}
