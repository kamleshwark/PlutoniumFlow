import { Injectable } from '@angular/core';
import { PublicClientApplication } from '@azure/msal-browser';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AzureAuthService {

  private msalInstance: PublicClientApplication;
  private azureAuthActive = false;
  constructor() {
  }

  createMsalInstance(settings: any) {
    this.msalInstance = new PublicClientApplication({
      auth: {
        clientId: settings.clientId,
        authority: settings.authority + settings.tenantId,
        redirectUri: settings.redirectUri
      },
      cache: { cacheLocation: 'localStorage', storeAuthStateInCookie: false }
    });
  }

  async login() {

    await this.msalInstance.initialize();
    return from(this.msalInstance.loginPopup({
      scopes: ['openid', 'profile', 'email']
    }));
  }

  logout() {
    return from(this.msalInstance.logoutPopup());
  }

  isAzureAuthActive(): boolean {
    return this.azureAuthActive;
  }

  setAzureAdSettings(settings: any) {
    if (settings.enable) {
      this.createMsalInstance(settings);
    }
    this.azureAuthActive = settings.enable;
  }

}
