import { Injectable } from '@nestjs/common';
import { Identity } from '@ory/client';
import { IdentityApiService } from 'src/identity-api.service';

@Injectable()
export class UsersManagerService {
  constructor(private identityApi: IdentityApiService) {}

  public createUsers(
    users: {
      email: string;
      firstName?: string;
      lastName?: string;
      accountType?: string;
    }[],
  ) {
    const promises: Promise<Identity>[] = [];
    for (const user of users) {
      const promise = this.identityApi
        .createIdentity({
          createIdentityBody: {
            schema_id: 'default',
            traits: {
              email: user.email,
              name: {
                first: user.firstName,
                last: user.lastName,
              },
              accountType: user.accountType,
            },
          },
        })
        .then((response) => response.data);
      promises.push(promise);
    }
    return Promise.all(promises);
  }

  public async deleteUser(userId: string) {
    await this.identityApi.deleteIdentity({
      id: userId,
    });
    return;
  }

  public updateUser(
    users: {
      userId: string;
      firstName: string;
      lastName: string;
      accountType: string;
    }[],
  ) {
    const promises: Promise<Identity>[] = [];
    for (const user of users) {
      const promise = this.identityApi
        .updateIdentity({
          id: user.userId,
          updateIdentityBody: {
            schema_id: 'default',
            state: 'active',
            traits: {
              name: {
                first: user.firstName,
                last: user.lastName,
              },
              accountType: user.accountType,
            },
          },
        })
        .then((response) => response.data);
      promises.push(promise);
    }
    return Promise.all(promises);
  }

  public getUsers() {
    return this.identityApi.listIdentities({});
  }
}
