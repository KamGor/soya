import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Configuration, FrontendApi } from '@ory/client';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {

  public login: string = '';
  public password: string = '';

  constructor(
    private httpClient: HttpClient,
  ) {}

  public async submit() {
    const config: Configuration = new Configuration({
      basePath: 'http://localhost:4433',
    });

    const kratos = new FrontendApi(config);

    const loginFlow = await kratos.createBrowserLoginFlow({}, {
      withCredentials: true,
    });

    const csrfToken = (loginFlow.data.ui.nodes.find(
      (node) =>
        node.attributes.node_type === 'input' &&
        node.attributes.name === 'csrf_token',
    )?.attributes as any)['value'] as string;

    const login = await kratos.updateLoginFlow({
      flow: loginFlow.data.id,
      updateLoginFlowBody: {
        password: this.password,
        method: 'password',
        identifier: this.login,
        csrf_token: csrfToken,
      }
    }, {
      withCredentials: true,
    });

    console.log(login);
  }

  public check() {
    firstValueFrom(this.httpClient.get('http://localhost:3000/configs/asd', {
      withCredentials: true,
    }));
  }
}
