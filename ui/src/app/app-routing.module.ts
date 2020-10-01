import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent, MemberMgmtComponent,
         CrewMgmtComponent, ServiceMgmtComponent } from './components';

const routes: Routes = [
  { path: '', pathMatch:'full', redirectTo: 'login'},
  { path:'login', loadChildren:'./modules/login/login.module#LoginModule'},
  { 
    path: 'dashboard', component:DashboardComponent,
    children:[
      {path: 'members',component: MemberMgmtComponent },
      {path: 'crew', component: CrewMgmtComponent},
      {path: 'services', component: ServiceMgmtComponent},
      {path : '**', redirectTo:'dashboard'}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
