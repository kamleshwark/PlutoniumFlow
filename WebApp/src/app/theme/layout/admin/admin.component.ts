// angular import
import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { Location } from '@angular/common';

// project import
import { DattaConfig } from 'src/app/app-config';
import { AdminService } from './services/admin.service';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BreakPointService } from 'src/app/services/breakPoint.service';
import { Breakpoints } from '@angular/cdk/layout';
import { MenuState } from './menu-state';
import { CommonFunctions } from 'src/app/utilities/CommonFunctions';
import { MatDrawer } from '@angular/material/sidenav';
import { CDrawerRequestData, DrawerComponent } from './drawer-component';
import { AlertService } from 'src/app/services/Alert.service';
import { AlertSeverity } from 'src/app/utilities/Alert';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None
})
export class AdminComponent implements OnInit, OnDestroy {
  @ViewChild('drawer') drawer!: MatDrawer;

  private adminService = inject(AdminService);
  private router = inject(Router);
  private breakPointService = inject(BreakPointService);
  private alertService = inject(AlertService);

  private subscriptions = new Array<Subscription>();

  private menuVisibleStateBeforeScreenSizeChange!: boolean;
  private navCollapsedStateBeforeScreenSizeChange!: boolean;
  navCollapsed = signal(false);
  navCollapsedMob: boolean;
  windowWidth: number;
  menuVisible = signal(true);
  pageTitle = '';
  isSmallScreen = false;
  MenuState = MenuState;
  menuState = computed(() => {
    if (this.menuVisible()) {
      return this.navCollapsed() ? MenuState.eCollapsed : MenuState.eExpanded;
    } else {
      return MenuState.eClosed;
    }
  });

  drawerComponent = DrawerComponent.eProjectAddEditDrawer;
  drawerClass = '';
  drawerData: any;

  constructor(private location: Location) {
    let current_url = this.location.path();
    if ((this.location as any)['_baseHref']) {
      current_url = (this.location as any)['_baseHref'] + this.location.path();
    }

    this.windowWidth = window.innerWidth;
    this.navCollapsed.set(this.windowWidth >= 960 ? (DattaConfig.isCollapseMenu as boolean) : false);
    this.navCollapsedMob = false;

    this.restoreNavCollpasedState();
    this.restoreMenuVisibleState();
  }

  ngOnDestroy(): void {
    try {
      this.adminService.resetDrawer();
      this.subscriptions.forEach((sub) => {
        sub.unsubscribe();
      });
    } catch (ex) {
      console.log('Error destructing Admin Component', ex);
    }
  }
  ngOnInit(): void {
    try {
      let sub = this.router.events.subscribe({
        next: (event) => {
          if (event instanceof NavigationStart) {
            this.adminService.setPageTitle('');
          }
        }
      });
      this.subscriptions.push(sub);

      sub = this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
          this.adminService.closeDrawer();
        }
        window.scrollTo(0, 0);
      });

      sub = this.adminService.pageTitleObservable.subscribe((data) => {
        this.onPageTitleSet(data);
      });
      this.subscriptions.push(sub);

      sub = this.breakPointService.breakPointChangeObservable.subscribe((bp) => {
        this.onBreakPointChange(bp);
      });
      this.subscriptions.push(sub);

      sub = this.adminService.drawerRequestObservable.subscribe((data) => {
        this.onDrawerOpenRequest(data);
      });
      this.subscriptions.push(sub);

      sub = this.adminService.drawwerCloseRequestObservable.subscribe((data) => {
        this.onDrawerCloseRequest(data);
      });
      this.subscriptions.push(sub);
    } catch (ex) {
      console.log('Error initialising Admin Component', ex);
    }
  }

  onDrawerOpenRequest(drawerInfo: CDrawerRequestData) {
    try {
      if (CommonFunctions.isValid(drawerInfo)) {
        this.drawerComponent = drawerInfo.Component;
        this.drawerClass = drawerInfo.Class;
        this.drawerData = drawerInfo.Data;
        this.drawer.open();
      }
    } catch (ex) {
      this.alertService.show(AlertSeverity.eError, 'Error opening drawer');
      console.log('Error opening drawer', ex);
    }
  }

  onDrawerCloseRequest(data: boolean) {
    try {
      this.drawerComponent = DrawerComponent.eNone;
      if (data && CommonFunctions.isValid(this.drawer)) {
        this.drawer.close();
      }
    } catch (ex) {
      this.alertService.show(AlertSeverity.eError, 'Error closing drawer');
      console.log('Error closing drawer', ex);
    }
  }

  onBreakPointChange(newBreakPoint: string) {
    try {
      if (Breakpoints.Large === newBreakPoint || Breakpoints.Medium === newBreakPoint) {
        console.log('Large/medium Screen', newBreakPoint);
        if (CommonFunctions.isValid(this.menuVisibleStateBeforeScreenSizeChange)) {
          this.menuVisible.set(this.menuVisibleStateBeforeScreenSizeChange);
        }
        if (CommonFunctions.isValid(this.navCollapsedStateBeforeScreenSizeChange)) {
          this.navCollapsed.set(this.navCollapsedStateBeforeScreenSizeChange);
        }
        this.isSmallScreen = false;
      } else {
        console.log('Non Large/medium Screen', newBreakPoint);
        this.menuVisibleStateBeforeScreenSizeChange = this.menuVisible();
        this.menuVisible.set(true);
        this.navCollapsedStateBeforeScreenSizeChange = this.navCollapsed();
        this.navCollapsed.set(false);
        this.isSmallScreen = true;
      }
    } catch (ex) {
      console.log('Error in Admin component, responding to breakpoint change', ex);
    }
  }
  onPageTitleSet(title: string) {
    try {
      this.pageTitle = title;
    } catch (ex) {
      console.log('Error setting page title', ex);
    }
  }
  navMobClick() {
    if (this.navCollapsedMob && !document.querySelector('app-navigation.pcoded-navbar')!.classList.contains('mob-open')) {
      this.navCollapsedMob = !this.navCollapsedMob;
      setTimeout(() => {
        this.navCollapsedMob = !this.navCollapsedMob;
      }, 100);
    } else {
      this.navCollapsedMob = !this.navCollapsedMob;
    }
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeMenu();
    }
  }

  closeMenu() {
    if (document.querySelector('app-navigation.pcoded-navbar')!.classList.contains('mob-open')) {
      document.querySelector('app-navigation.pcoded-navbar')?.classList.remove('mob-open');
    }
  }

  onNavCollapsed() {
    try {
      this.navCollapsed.update((value) => !value);
      this.saveNavCollapsedState();
    } catch (ex) {
      console.log('Error in onNavCollapsed', ex);
    }
  }

  navClosed() {
    try {
      this.menuVisible.set(false);
      this.saveMenuVisibleState();
    } catch (ex) {
      console.log('Error closing menu', ex);
    }
  }

  onNavOpen() {
    try {
      if (this.isSmallScreen) {
        this.navMobClick();
      } else {
        this.menuVisible.set(true);
        this.saveMenuVisibleState();
      }
    } catch (ex) {
      console.log('Error opening menu', ex);
    }
  }

  saveMenuVisibleState() {
    localStorage.setItem('menuVisible', this.menuVisible().toString());
  }

  restoreMenuVisibleState() {
    const menuVisibleStorage = localStorage.getItem('menuVisible');
    if (CommonFunctions.isValid(menuVisibleStorage)) {
      this.menuVisible.set(JSON.parse(menuVisibleStorage!));
    }
  }

  saveNavCollapsedState() {
    localStorage.setItem('navCollapsed', this.navCollapsed().toString());
  }

  restoreNavCollpasedState() {
    const navCollapsedStorage = localStorage.getItem('navCollapsed');
    if (CommonFunctions.isValid(navCollapsedStorage)) {
      this.navCollapsed.set(JSON.parse(navCollapsedStorage!));
    }
  }
}
