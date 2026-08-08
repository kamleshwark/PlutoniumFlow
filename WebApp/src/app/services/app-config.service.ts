import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  http = inject(HttpClient);
  private config: any;

  constructor() { 
  }

  loadConfig(): Promise<void> {
    return firstValueFrom(this.http
      .get('/assets/config/config.json'))
      .then((data: any) => {
        this.config = data;
      })
      .catch((error) => {
        console.error('Could not load config.json:', error);
        throw error;
      });
  }
  get apiUrl(): string {
    return this.config?.apiUrl || '';
  }

  get dashboardSettings(): any {
    return this.config?.dashboard;
  }

  get bryntumExportServerUrl(): string {
    return this.config?.bryntumExportServer || 'https://dev.bryntum.com:8082';
  }

  get topChainsCount():number {
    return this.config?.topChainsCount;
  }

  get subtasksSettings(): any {
    return this.config?.subtasks;
  }

  get defaultPassword(): string {
    return this.config?.defaultPassword || 'Pa$$w0rd';
  }
}
