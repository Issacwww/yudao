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
import { DashboardComponent, MemberMgmtComponent } from './components';

// Services
import { RequestService,StorageService,DateService } from './services';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MemberMgmtComponent
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
  providers: [RequestService, StorageService, DateService],
  bootstrap: [AppComponent]
})
export class AppModule { }
