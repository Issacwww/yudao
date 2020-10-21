import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent, MemberMgmtComponent,
         CrewMgmtComponent, ServiceMgmtComponent,FinanceComponent,
         ServeComponent, RoomMgmtComponent, StatisticComponent,
         TopupComponent, SpendingComponent, OrderComponent  } from './components';
import { IsUserLoggedIn } from './services';

const routes: Routes = [
  { path: '', pathMatch:'full', redirectTo: 'login'},
  { path:'login', loadChildren:'./modules/login/login.module#LoginModule'},
  { 
    path: 'dashboard', component:DashboardComponent,
    children:[
      {path: 'members',component: MemberMgmtComponent},
      {path: 'crew', component: CrewMgmtComponent},
      {path: 'services', component: ServiceMgmtComponent},
      {
        path: 'finance', component: FinanceComponent,
        children:[
          {path:'topup', component: TopupComponent},
          {path:'spending', component: SpendingComponent},
          {path:'order', component: OrderComponent},
          {path : '**', redirectTo: 'order'}
        ]
      },
      // {path:'stores',canActivate:[IsSuperAdmin]},
      {path: 'serve', component: ServeComponent},
      {path: 'rooms', component: RoomMgmtComponent},
      {path: 'statistic', component: StatisticComponent},
      {path : '**', redirectTo:'serve'}
    ],
    canActivate: [IsUserLoggedIn]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
