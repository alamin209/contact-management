import { Injectable, SkipSelf } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, shareReplay } from 'rxjs';
import { environment } from '@environments/environment';
// import { MicroserviceURL } from '@core/enum/microservices.enum';
// import { ApiConfigService } from '@core/services/api-config.service';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  // baseUrl = this.apiConfigService.getUrl(MicroserviceURL.DEFAULT) + `block`;

  constructor(private _httpClient: HttpClient) {}

  baseUrl = (path: string) => {
    return environment.default_api + path;
  };

  pagination = (path: string, extraParam: string = ''): Observable<any> => {
    const url: string = `${path}${extraParam}`;
    return this._httpClient
      .get(`${this.baseUrl(url)}`)
      .pipe(map((response: any) => response));
  };

  adminPagination = (
    page: number,
    limit: number,
    sort: string,
    order: string,
    path: string,
    extraParam: string = ''
  ): Observable<any> => {
    let url: string = `admin/pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}${extraParam}`;
    return this._httpClient
      .get(`${this.baseUrl(path)}/${url}`)
      .pipe(map((response: any) => response?.page));
  };

  create = (path: string, dto: any): Observable<any> => {
    // console.log(dto);
    return this._httpClient.post(`${this.baseUrl(path)}`, dto);
  };

  remove = (path: string, id: string): Observable<any> =>
    this._httpClient.delete(`${this.baseUrl(path)}/${id}`);

  getById = (path: string, id: string): Observable<any> =>
    this._httpClient
      .get(`${this.baseUrl(path)}/${id}`)
      .pipe(map((response: any) => response?.payload?.data));

  update = (path: string, id: string, dto: any): Observable<any> =>
    this._httpClient.put(`${this.baseUrl(path)}/${id}`, dto);

  getList = (path: string): Observable<any> =>
    this._httpClient.get(`${this.baseUrl(path)}`).pipe(
      map((response: any) => response?.payload?.data),
      shareReplay()
    );

  getFileUrl = (id: string, path: string = 'assets') =>
    `${this.baseUrl(path)}/${id}`;

  getCustomData = (path: string): Observable<any> => {
    return this._httpClient.get(`${path}`);
  };

  blocktList = (): Observable<any> => {
    let blocktList$ = this._httpClient.get(`${this.baseUrl('block')}`).pipe(
      map((response: any) => response?.payload?.data),
      shareReplay(1)
    );
    return blocktList$;
  };
}
