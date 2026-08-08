import { Component, Injectable } from '@angular/core';
import { CommonFunctions } from '../utilities/CommonFunctions';
import { PreloadableComponent } from '../models/Enums.enum';

@Injectable({
  providedIn: 'root'
})
export class ComponentsPreloadingService {

  private loadedComponents = new Map<PreloadableComponent, any>();
  constructor() { }

  async load(componentId: PreloadableComponent) {
    if (!CommonFunctions.isValid(this.loadedComponents.get(componentId))) {
      console.log('Pre loading component', componentId);
      const startTime = new Date();
      let component: any;
      switch (componentId) {
        case PreloadableComponent.eNewUserDrawer:
          const newUserModule = await import('./../features/UserManagement/NewUserDrawer/NewUserDrawer.component');
          component = newUserModule.NewUserDrawerComponent;
          break;
        
        default:
          break;
      }
      if (CommonFunctions.isValid(component)) {
        this.loadedComponents.set(componentId, component);
        const finishTime = new Date();
        console.log(componentId + ' Component Loading time (ms)', finishTime.getTime() - startTime.getTime());
      }
    } else {
      console.log(componentId + ' has been loaded already');
      
    }
  }

  getComponent(componentId: PreloadableComponent): any {
    return this.loadedComponents.get(componentId);
  }

  isLoaded(componentId: PreloadableComponent): boolean {
    return CommonFunctions.isValid(this.getComponent(componentId));
  }

}
