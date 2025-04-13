import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import OAuth from 'oauth-1.0a';
import { Observable, catchError } from 'rxjs';
import { FLUIG_AUTH_CONFIG } from './fluig-auth.token';
import { FluigAuthConfig } from './fluig-auth.token';

@Injectable({
  providedIn: 'root',
})
export class FluigAuthService {
  private headers: HttpHeaders | undefined;
  private oauthClient: OAuth;
  private config: FluigAuthConfig;

  constructor(private http: HttpClient) {
    this.config = inject(FLUIG_AUTH_CONFIG);
    this.oauthClient = new OAuth({
      consumer: {
        key: this.config.oauth.app.consumerKey,
        secret: this.config.oauth.app.consumerSecret,
      },
      signature_method: 'PLAINTEXT',
    });
  }

  private getAuthorization(data: {
    url: string;
    method: string;
  }): { headers: HttpHeaders } | undefined {
    if (!this.config.development) return undefined;
    if (this.config.oauth.type === 'app') {
      return {
        headers: new HttpHeaders({
          ...this.oauthClient.toHeader(
            this.oauthClient.authorize(data, {
              key: this.config.oauth.app.accessToken,
              secret: this.config.oauth.app.tokenSecret,
            }),
          ),
        }),
      };
    } else {
      return {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + this.config.oauth.token,
        }),
      };
    }
  }

  private setHeaders(
    method: string,
    url: string,
  ): { headers: HttpHeaders } | undefined {
    const headers = this.getAuthorization({ url, method });
    headers?.headers.set('Content-Type', 'application/json;charset=UTF-8');
    return headers;
  }

  public get makeRequest(): {
    GET: <T>(url: string, params?: any) => Observable<T>;
    POST: <T>(url: string, body: any, params?: any) => Observable<T>;
    PUT: <T>(url: string, body: any, params?: any) => Observable<T>;
    DELETE: <T>(url: string, params?: any) => Observable<T>;
  } {
    return {
      GET: <T>(url: string, params?: any) => {
        return this.http
          .get<T>(url, {
            params,
            responseType: 'json',
            ...this.setHeaders('GET', url),
          })
          .pipe(
            catchError((error) => {
              throw new Error(error);
            }),
          );
      },
      POST: <T>(url: string, body: any, params?: any) => {
        return this.http
          .post<T>(url, body, {
            params,
            responseType: 'json',
            ...this.setHeaders('POST', url),
          })
          .pipe(
            catchError((error) => {
              throw new Error(error);
            }),
          );
      },
      PUT: <T>(url: string, body: any, params?: any) => {
        return this.http
          .put<T>(url, body, {
            params,
            responseType: 'json',
            ...this.setHeaders('PUT', url),
          })
          .pipe(
            catchError((error) => {
              throw new Error(error);
            }),
          );
      },
      DELETE: <T>(url: string, params?: any) => {
        return this.http
          .delete<T>(url, {
            params,
            responseType: 'json',
            ...this.setHeaders('DELETE', url),
          })
          .pipe(
            catchError((error) => {
              throw new Error(error);
            }),
          );
      },
    };
  }

  public makeBlobRequest(url: string, params?: any): Observable<Blob> {
    return this.makeRequest.GET<Blob>(url, params);
  }
}
