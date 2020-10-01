// Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material-module';
import { LoginModule, DialogModule } from './modules';

// Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent, MemberMgmtComponent, CrewMgmtComponent, ServiceMgmtComponent } from './components';

// Services
import { RequestService,StorageService,DateService,FilterService } from './services';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MemberMgmtComponent,
    CrewMgmtComponent,
    ServiceMgmtComponent
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
    MaterialModule
  ],
  providers: [RequestService, StorageService, DateService, FilterService],
  bootstrap: [AppComponent]
})
export class AppModule { }
