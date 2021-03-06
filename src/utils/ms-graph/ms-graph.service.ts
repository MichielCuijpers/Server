import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import fetch from 'node-fetch';
import { Client, ClientOptions } from '@microsoft/microsoft-graph-client';
import 'isomorphic-fetch';
import { UserInput } from '../../domain/user/user.dto';
import { AzureADStrategy } from '../authentication/aad.strategy';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { LogContexts } from '../logging/logging.contexts';

@Injectable()
export class MsGraphService {
  constructor(
    @Inject(forwardRef(() => AzureADStrategy))
    private azureAdStrategy: AzureADStrategy,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger
  ) {}

  async callResourceAPI(accessToken: string, resourceURI: string) {
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-type': 'application/json',
        Accept: 'application/json',
        'Accept-Charset': 'utf-8',
      },
    };

    const response = await fetch(resourceURI, options);
    const json = await response.json();
    return json;
  }

  async createUser(userData: UserInput, accountUpn: string): Promise<any> {
    const clientOptions: ClientOptions = {
      authProvider: this.azureAdStrategy,
    };
    const client = Client.initWithMiddleware(clientOptions);

    const mailNickname = this.getMailNickname(userData.email);
    const user = {
      accountEnabled: true,
      givenName: userData.firstName,
      surname: userData.lastName,
      displayName: userData.name,
      mailNickname: mailNickname,
      userPrincipalName: accountUpn,
      mail: userData.email.trim(),
      passwordProfile: {
        forceChangePasswordNextSignIn: true,
        password: userData.aadPassword,
      },
    };

    const res = await client.api('/users').post(user);

    return res;
  }

  async deleteUser(accountUpn: string): Promise<any> {
    const clientOptions: ClientOptions = {
      authProvider: this.azureAdStrategy,
    };
    const client = Client.initWithMiddleware(clientOptions);
    const res = await client.api(`/users/${accountUpn}`).delete();

    return res;
  }

  async getOrganisation(client: Client): Promise<any> {
    const res = await client.api('/organization').get();
    return res;
  }

  async getUser(client: Client | undefined, accountUpn: string): Promise<any> {
    if (!client) {
      const clientOptions: ClientOptions = {
        authProvider: this.azureAdStrategy,
      };
      client = Client.initWithMiddleware(clientOptions);
    }

    let res = undefined;
    try {
      res = await client.api(`/users/${accountUpn}`).get();
    } catch (error) {
      this.logger.error(error.msg, error, LogContexts.AUTH);
    }
    return res;
  }

  async userExists(
    client: Client | undefined,
    accountUpn: string
  ): Promise<boolean> {
    let user;
    try {
      user = await this.getUser(client, accountUpn);
    } catch (error) {
      this.logger.error(error.msg, error, LogContexts.AUTH);
    }

    if (user) return true;
    return false;
  }

  getMailNickname(email: string): string {
    return email.split('@')[0];
  }

  async getTenantName(client: Client): Promise<string | undefined> {
    let tenantName = undefined;
    try {
      const org = await this.getOrganisation(client);
      tenantName = org.value[0]['verifiedDomains'][0]['name'];
    } catch (error) {
      this.logger.error(error.msg, error, LogContexts.AUTH);
    }

    return tenantName;
  }
}
