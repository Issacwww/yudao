import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material-module';

import { RequestService, StorageService } from '../../services';
import { LoginComponent, AdminComponent, StoreManagerComponent } from '.'

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
