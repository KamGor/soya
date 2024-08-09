import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { LoggedPageComponent } from './logged-page/logged-page.component';
import { authenticatedGuard } from './authenticated.guard';
import { unauthenticatedGuard } from './unauthenticated.guard';
import { ConfigsPageComponent } from './logged-page/configs/configs-page/configs-page.component';
import { UsersPageComponent } from './logged-page/users/users-page/users-page.component';
import { DashboardPageComponent } from './logged-page/dashboard-page/dashboard-page.component';
import { TagsPageComponent } from './logged-page/tags/tags-page/tags-page.component';
import { ConnectionsPageComponent } from './logged-page/connections-page/connections-page.component';
import { GenericRouterPageComponent } from './logged-page/generic-router-page/generic-router-page.component';
import { AddConfigPageComponent } from './logged-page/configs/add-config-page/add-config-page.component';
import { AddUserPageComponent } from './logged-page/users/add-user-page/add-user-page.component';
import { AddTagPageComponent } from './logged-page/tags/add-tag-page/add-tag-page.component';
import { EditConfigPageComponent } from './logged-page/configs/edit-config-page/edit-config-page.component';
import { EditTagPageComponent } from './logged-page/tags/edit-tag-page/edit-tag-page.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate: [unauthenticatedGuard],
  },
  {
    path: '',
    component: LoggedPageComponent,
    canActivate: [authenticatedGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        component: DashboardPageComponent,
      },
      {
        path: 'connections',
        component: GenericRouterPageComponent,
        children: [
          {
            path: '',
            component: ConnectionsPageComponent
          },
          {
            path: '**',
            redirectTo: '',
          }
        ],
      },
      {
        path: 'configs',
        component: GenericRouterPageComponent,
        children: [
          {
            path: '',
            component: ConfigsPageComponent,
          },
          {
            path: 'add',
            component: AddConfigPageComponent,
          },
          {
            path: 'edit/:configId',
            component: EditConfigPageComponent,
          },
          {
            path: '**',
            redirectTo: '',
          }
        ],
      },
      {
        path: 'tags',
        component: GenericRouterPageComponent,
        children: [
          {
            path: '',
            component: TagsPageComponent,
          },
          {
            path: 'add',
            component: AddTagPageComponent,
          },
          {
            path: 'edit/:tagId',
            component: EditTagPageComponent,
          },
          {
            path: '**',
            redirectTo: '',
          }
        ],
      },
      {
        path: 'users',
        component: GenericRouterPageComponent,
        children: [
          {
            path: '',
            component: UsersPageComponent,
          },
          {
            path: 'add',
            component: AddUserPageComponent,
          },
          {
            path: '**',
            redirectTo: '',
          }
        ],
      },
      {
        path: '**',
        redirectTo: 'dashboard',
      }
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
