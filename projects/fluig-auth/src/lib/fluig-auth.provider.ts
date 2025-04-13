import { Provider } from '@angular/core';
import { FluigAuthService } from './fluig-auth.service';
import { FLUIG_AUTH_CONFIG, FluigAuthConfig } from './fluig-auth.token';

export function provideFluigAuth(config: FluigAuthConfig): Provider[] {
  return [FluigAuthService, { provide: FLUIG_AUTH_CONFIG, useValue: config }];
}
