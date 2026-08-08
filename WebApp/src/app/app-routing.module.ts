import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { NotFoundComponent } from './theme/layout/admin/NotFound/NotFound.component';
import { routeGuard } from './guards/route.guard';

const routes: Routes = [
  {
    path: 'auth',
    component: GuestComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./features/auth/authentication.module').then((m) => m.AuthenticationModule)
      }
    ]
  },
  {
    path: 'fkmgmt',
    canActivateChild: [routeGuard], 
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./theme/layout/home/home.component')
      },
      {
        path: 'dashboard',
        // loadChildren: () => import('./features/fkMgmt/Reports/Dashboard/dashboard.module').then((m) => m.DashboardModule)
      },
      {
        path: 'ccpm-dashboard',
        // loadComponent: () => import('./features/fkMgmt/Reports/CCPMDashboard/CCPMDashboardMain/CCPMDashboardMain.component')
      },
      {
        path: 'fkmgmt',
        loadChildren: () => import('./features/fkMgmt/fk-mgmt.module').then((m) => m.FkMgmtModule)
      },
      {
        path: 'fkcreate',
        // loadChildren: () => import('./features/fkMgmt/FKCreation/fk-creation.module').then((m) => m.FKCreationModule)
      },
      {
        path: 'fkexecute',
        // loadChildren: () => import('./features/fkMgmt/FKExecution/fk-execution.module').then((m) => m.FKExecutionModule)
      },
      {
        path: 'fkstatus',
        // loadChildren: () => import('./features/fkMgmt/FKStatusReport/fk-status-report.module').then((m) => m.FkStatusReportModule)
      },
      {
        path: 'admin',
        loadChildren: () => import('./features/fkMgmt/Admin/admin.module').then((m) => m.AdminModule)
      },
      {
        path: 'my-actions',
        // loadComponent: () => import('./features/fkMgmt/IssueMgmt/ActionList/ActionListForOwnerMain/ActionListForOwnerMain.component')
      },
      {
        path: 'my-issues',
        // loadComponent: () => import('./features/fkMgmt/IssueMgmt/MyIssues/MyIssues.component')
      },
      {
        path: 'task-updates',
        // loadComponent: () => import('./features/fkMgmt/TaskExecution/TaskUpdates/TaskUpdatesMain/TaskUpdatesMain.component'),
      },
      {
        path: 'budget-report',
        // loadComponent: () => import('./features/fkMgmt/Budget/BudgetReport/BudgetReport.component')
      },
      {
        path: 'poogi',
        children:[
          {
            path: 'pareto-chart',
            // loadComponent: () => import('./features/fkMgmt/POOGI/ReasonParetoChart/ReasonParetoChartMain/ReasonParetoChartMain.component')
          },
          {
            path: 'reason-master',
            // loadComponent: () => import('./features/fkMgmt/POOGI/ReasonMaster/ReasonMasterMain/ReasonMasterMain.component')
          }
        ]
      },
      {
        path: 'change-password',
        loadComponent: () => import('./features/auth/ChangePassword/ChangePassword.component')
      },
    ]
  },
  {
    path: 'supplyFlow',
    canActivateChild: [routeGuard], 
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./theme/layout/home/home.component')
      },
      {
        path: 'bpr',
        loadComponent: () => import('./features/supplyFlow/BufferPenetrationReport/BufferPenetrationReport.component')
      },
      {
        path: 'btg',
        loadComponent: () => import('./features/supplyFlow/BufferTrendGraphMain/BufferTrendGraphMain.component')
      },
      
    ]
  },
  {
    path: 'fkmgmt',
    component: AdminComponent,
    children: [
      { path: 'notFound', component: NotFoundComponent, pathMatch: 'full' },
    ]
  },
  {
    path: '',
    canActivateChild: [routeGuard], 
    children: [
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        redirectTo: '/fkmgmt/home',
        pathMatch: 'full'
      },
      {
        path: '**', 
        redirectTo: '/fkmgmt/notFound',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
