import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material-module';


import { StoreManagerComponent } from './store-manager/store-manager.component';
import { AdminComponent } from './admin/admin.component';

import { RequestService, StorageService } from '../../services';
import { LoginComponent } from './login.component'

@NgModule({
  declarations: [
    StoreManagerComponent,
    AdminComponent,
    LoginComponent
  ],
  exports:[
    LoginComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTabsModule, MaterialModule,
    RouterModule.forChild([
      {
        path:'login', component: LoginComponent,
        children:[
          {path:'store-manager', component: StoreManagerComponent, data:{ label: '店长登录'}},
          {path:'admin', component: AdminComponent, data:{label:'管理员登录'}},
          {path : '**', redirectTo:'store-manager'}
        ]
      }
    ])
  ],
  providers:[RequestService, StorageService]
})
export class LoginModule { }
