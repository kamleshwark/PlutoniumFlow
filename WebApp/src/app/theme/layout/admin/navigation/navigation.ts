import { inject, Injectable } from '@angular/core';
import { clone } from 'lodash-es';
import { MenuConfigService } from 'src/app/services/menu-config.service';
import { UserService } from 'src/app/services/user.service';
import { CAPTIONS } from 'src/app/utilities/captions';
import { CommonFunctions } from 'src/app/utilities/CommonFunctions';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  function?: any;
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}

const NavigationItems = [
  {
    id: 'fk-mgmt',
    title: 'FLOW',
    type: 'group',
    icon: 'icon-ui',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        url: '/fkmgmt/dashboard/main',
        icon: 'feather icon-monitor',
      },
      {
        id: 'bpr',
        title: 'Buffer Penetration Report',
        type: 'item',
        url: '/supplyFlow/bpr',
        icon: 'feather icon-flag',
      },
      {
        id: 'btg',
        title: 'Buffer Trend Graph',
        type: 'item',
        url: '/supplyFlow/btg',
        icon: 'feather icon-activity',
      },
      // {
      //   id: 'ccpm-dashboard',
      //   title: 'CCPM Dashboard',
      //   type: 'item',
      //   url: '/fkmgmt/ccpm-dashboard',
      //   icon: 'feather icon-monitor',
      // },
      
      
    ]
  },
  {
    id: 'misc',
    title: 'Misc',
    type: 'group',
    icon: 'icon-ui',
    children: [
      {
        id: 'admin',
        title: 'ADMIN',
        type: 'collapse',
        icon: 'feather icon-sliders',
        children: [
          {
            id: 'run',
            title: 'Run',
            type: 'item',
            url: '/fkmgmt/admin/run',
          },
          {
            id: 'userMgmt',
            title: 'User Management',
            type: 'item',
            url: '/fkmgmt/admin/userMgmt',
          }
        ]
      },
      {
        id: 'change-password',
        title: 'Change Password',
        type: 'item',
        url: '/fkmgmt/change-password',
        icon: 'feather icon-lock',
      },
    ]
  },
];

@Injectable()
export class NavigationItem {
  private menuService = inject(MenuConfigService);
  private userService = inject(UserService);

  constructor() {
  }
  get() {
    const filteredMenu: any[] = [];
    this.getAsPerRole(NavigationItems, filteredMenu);
    
    return filteredMenu;
  }

  getAsPerRole(srcMenuList: any[], filteredMenuList: any[]) {
    const navItems = [];
    srcMenuList.forEach(srcMenuItem => {
      const userRoles = this.userService.getUserRoles();
      const hastAccess = this.menuService.hasAccess(srcMenuItem.id, userRoles);

      if(hastAccess) {
        const clonnedMenu = clone(srcMenuItem);
        const title = this.menuService.getTitle(srcMenuItem.id);
        if (!CommonFunctions.isStringNullOrEmpty(title)) {
          clonnedMenu.title = title;
        }
        filteredMenuList.push(clonnedMenu);
        if(CommonFunctions.isValid(clonnedMenu.children)) {
          clonnedMenu.children = [];
          this.getAsPerRole(srcMenuItem.children, clonnedMenu.children)
        }
      }
    });
  }
}
