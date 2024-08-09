import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoggedPageComponent } from './logged-page/logged-page.component';
import { ConfigsPageComponent } from './logged-page/configs/configs-page/configs-page.component';
import { DashboardPageComponent } from './logged-page/dashboard-page/dashboard-page.component';
import { UsersPageComponent } from './logged-page/users/users-page/users-page.component';
import { TagsPageComponent } from './logged-page/tags/tags-page/tags-page.component';
import { ConnectionsPageComponent } from './logged-page/connections-page/connections-page.component';
import { GenericRouterPageComponent } from './logged-page/generic-router-page/generic-router-page.component';
import { AddConfigPageComponent } from './logged-page/configs/add-config-page/add-config-page.component';
import { AddUserPageComponent } from './logged-page/users/add-user-page/add-user-page.component';
import { AddTagPageComponent } from './logged-page/tags/add-tag-page/add-tag-page.component';
import { NgxSonnerToaster } from 'ngx-sonner';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatDialogModule } from '@angular/material/dialog';
import { DeleteConfirmDialogComponent } from './delete-confirm-dialog/delete-confirm-dialog.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TableModule } from 'primeng/table';
import { EditTagPageComponent } from './logged-page/tags/edit-tag-page/edit-tag-page.component';
import { EditConfigPageComponent } from './logged-page/configs/edit-config-page/edit-config-page.component';
import { AutoCompleteModule } from 'primeng/autocomplete';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    LoggedPageComponent,
    ConfigsPageComponent,
    DashboardPageComponent,
    UsersPageComponent,
    TagsPageComponent,
    ConnectionsPageComponent,
    GenericRouterPageComponent,
    AddConfigPageComponent,
    AddUserPageComponent,
    AddTagPageComponent,
    DeleteConfirmDialogComponent,
    EditTagPageComponent,
    EditConfigPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSonnerToaster,
    MatDialogModule,
    MatPaginatorModule,
    TableModule,
    AutoCompleteModule,
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
