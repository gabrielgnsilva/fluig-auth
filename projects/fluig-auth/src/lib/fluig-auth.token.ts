import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface FluigAuthConfig {
  url: string;
  development: boolean;
  oauth: {
    type: string;
    token: string;
    app: {
      requestURL?: string;
      accessURL?: string;
      authorizeURL?: string;
      consumerKey: string;
      consumerSecret: string;
      accessToken: string;
      tokenSecret: string;
    };
  };
}

export const FLUIG_AUTH_CONFIG = new InjectionToken<FluigAuthConfig>(
  'FLUIG_AUTH_CONFIG',
);
