// angular import
import { NgModule, APP_INITIALIZER  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

// project import
import { AppComponent } from './app.component';
import { SharedModule } from './theme/shared/shared.module';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { NavigationComponent } from './theme/layout/admin/navigation/navigation.component';
import { NavContentComponent } from './theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavLogoComponent } from './theme/layout/admin/navigation/nav-logo/nav-logo.component';
import { NavCollapseComponent } from './theme/layout/admin/navigation/nav-content/nav-collapse/nav-collapse.component';
import { NavGroupComponent } from './theme/layout/admin/navigation/nav-content/nav-group/nav-group.component';
import { NavItemComponent } from './theme/layout/admin/navigation/nav-content/nav-item/nav-item.component';
import { NavigationItem } from './theme/layout/admin/navigation/navigation';
import { ToggleFullScreenDirective } from './theme/shared/components/full-screen/toggle-full-screen';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './interceptors/jwt.interceptor';
import { NavBarComponent } from './theme/layout/admin/nav-bar/NavBar/NavBar.component';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { BackButtonDisableModule } from 'angular-disable-browser-back-button';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DrawerContainerComponent } from './theme/layout/admin/DrawerContainer/DrawerContainer.component';
import { DisableSwipeDrawerDirective } from './directives/DisableSwipeDrawer.directive';
import { AppConfigService } from './services/app-config.service';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import { MenuConfigService } from './services/menu-config.service';

export function initializeAppConfig(appConfigService: AppConfigService) {
  return () => appConfigService.loadConfig(); // Returns a promise
}
export function initializeMenuConfig(menuConfig: MenuConfigService) {
  return () => menuConfig.loadConfig();
}

@NgModule({
  declarations: [
    AppComponent,
    GuestComponent,
    AdminComponent,
    DrawerContainerComponent,
    NavigationComponent,
    NavContentComponent,
    NavLogoComponent,
    NavCollapseComponent,
    NavGroupComponent,
    NavItemComponent,
    ToggleFullScreenDirective,
    NavBarComponent,
    DisableSwipeDrawerDirective
  ],
  imports: [BrowserModule, 
    AppRoutingModule, 
    SharedModule, 
    BrowserAnimationsModule,
    NzDropDownModule,
    BackButtonDisableModule.forRoot({
      preserveScroll: true
    }),
    ToastModule,
    MatSidenavModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    NavigationItem,
    provideHttpClient(withInterceptors([jwtInterceptor])),
    MessageService,
    ConfirmationService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppConfig,
      deps: [AppConfigService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeMenuConfig,
      deps: [MenuConfigService],
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
