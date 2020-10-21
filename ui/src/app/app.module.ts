// Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material-module';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { LoginModule, DialogModule } from './modules';
import { MAT_DATE_LOCALE} from '@angular/material/core';
import { ChartsModule } from 'ng2-charts';

// Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent, MemberMgmtComponent, 
  CrewMgmtComponent, ServiceMgmtComponent,
  RoomMgmtComponent, ServeComponent,StatisticComponent,
  FinanceComponent, TopupComponent, SpendingComponent, OrderComponent } from './components';

// Services
import { RequestService, StorageService, DateService,AuthService, 
         FilterService, getChinesePaginatorIntl, AvailablePipe, IsSuperAdmin, IsUserLoggedIn,  } from './services';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MemberMgmtComponent,
    CrewMgmtComponent,
    ServiceMgmtComponent,
    FinanceComponent,
    TopupComponent,
    SpendingComponent,
    OrderComponent,
    RoomMgmtComponent,
    ServeComponent,
    StatisticComponent,
    AvailablePipe
  ],
  imports: [
    BrowserModule,
    LoginModule,
    DialogModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    ChartsModule
  ],
  providers: [RequestService, StorageService, DateService, 
    FilterService, AuthService, IsSuperAdmin, IsUserLoggedIn, 
    { provide: MatPaginatorIntl, useValue: getChinesePaginatorIntl() },
    { provide: MAT_DATE_LOCALE, useValue: 'zh-CN'}

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
