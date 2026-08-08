import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'run',
        loadComponent: () => import('./RunTrigger/RunTrigger.component')
      },
      {
        path: 'userMgmt',
        loadComponent: () => import('./../../UserManagement/UserList/UserList.component')
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
