import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CommonFunctions } from '../utilities/CommonFunctions';
import Enumerable from 'linq';

@Injectable({
  providedIn: 'root'
})
export class MenuConfigService {
  private http = inject(HttpClient);
  private menuConfig: any[];

  constructor() { }

  loadConfig(): Promise<void> {
    return firstValueFrom(this.http
      .get('/assets/config/menu.json'))
      .then((data: any) => {
        this.menuConfig = data;
      })
      .catch((error) => {
        console.error('Could not load menu.json:', error);
        throw error;
      });
  }

  getTitle(id: string): string {
    const config = this.menuConfig.find(m => id === m.id);
    if(CommonFunctions.isValid(config)) {
      return config.title;
    } else {
      return null;
    }
  }

  hasAccess(id: string, roles: string[]): boolean {
    let isAllowed = true;
    const config = this.menuConfig.find(m => id === m.id);
    if(CommonFunctions.isValid(config) && 0 < config.roles.length) {
      const matchCount = Enumerable.from(config.roles)
        .join(roles,
          cr => cr,
          tr => tr,
          (cr: string, tr: string) => {
            return 1;
          }
        ).toArray().length;
      if(0 === matchCount) {
        isAllowed = false;
      }
    } 
    return isAllowed;
  }
}
