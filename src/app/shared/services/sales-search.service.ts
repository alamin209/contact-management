import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { SystemService } from './system.service';
import { MicroserviceURL } from '@core/enum/microservices.enum';
import { PromotionType } from '@core/enum/promotion-type.enum';
import { ApiConfigService } from '@core/services/api-config.service';
import { TokenStorageService } from '@core/services/token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class SalesSearchService {
  userBaseUrl = this.apiConfigService.getUrl(MicroserviceURL.DEFAULT);
  mainBaseUrl = this.apiConfigService.getUrl(MicroserviceURL.DEFAULT);
  coreBaseUrl = this.apiConfigService.getUrl(MicroserviceURL.DEFAULT);

  promotionType = PromotionType;
  promotionTypeArray: any[] = [];

  shippingStatusArray = [
    { id: '1', name: 'Assigned to Delivery Person' },
    { id: '2', name: 'On the Way' },
    { id: '3', name: 'Delivered' },
    // {id:'4' , name: 'Returned'},
  ];

  yesNoArray = [
    { id: '1', name: 'Yes' },
    { id: '0', name: 'No' },
  ];

  approvalArray = [
    { id: '1', name: 'Approved' },
    { id: '0', name: 'Unapproved' },
  ];

  withdrawStatusArray = [
    { id: '0', name: 'PENDING' },
    { id: '1', name: 'APPROVED' },
    { id: '2', name: 'REJECTED' },
    { id: '3', name: 'CANCELLED' },
  ];

  constructor(
    private readonly _httpClient: HttpClient,
    private apiConfigService: ApiConfigService,
    private readonly token: TokenStorageService,
    private readonly system: SystemService
  ) {
    this.promotionTypeArray = this.system.enumToArray(this.promotionType);
  }

  entitySearch = (
    page: number,
    limit: number,
    sort: string,
    order: string,
    isApproved: number,
    name: string,
    entity: string
  ): Observable<any> => {
    let requestResult: any;

    if (entity == 'shop') {
      if (this.token.isEditor()) {
        // search shop of the merchant who is logined
        requestResult = this._httpClient.get(
          `${this.mainBaseUrl}merchant/shops/merchant-shops-pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}&isApproved=${isApproved}&name=${name}`
        );
      } else {
        // search all shop
        requestResult = this._httpClient.get(
          `${this.mainBaseUrl}admin/shops/pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}&isApproved=${isApproved}&name=${name}`
        );
      }
    }

    if (entity == 'product') {
      if (this.token.isEditor()) {
        // search products of the merchant who is logined
        requestResult = this._httpClient.get(
          `${this.mainBaseUrl}merchant/products/pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}&name=${name}`
        );
      } else {
        // search all products
        requestResult = this._httpClient.get(
          `${this.mainBaseUrl}admin/products/pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}&name=${name}`
        );
      }
    }

    if (entity == 'customer') {
      // search all customer
      requestResult = this._httpClient.get(
        `${this.userBaseUrl}users/find/customer-pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}&isApproved=${isApproved}&firstName=${name}`
      );
    }

    if (entity == 'merchant') {
      // search all merchant
      requestResult = this._httpClient.get(
        `${this.userBaseUrl}merchants/find/merchants-pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}&isApproved=${isApproved}&firstName=${name}`
      );
    }

    let result = requestResult.pipe(
      map((res: any) => this.dataMaping(res, entity, 'page'))
    );

    // console.log(result);

    return result;
  };

  getDropdown = (entity: string): Observable<any> => {
    let requestResult: any;
    let entityName = entity.toLowerCase();

    requestResult = of(entityName).pipe(
      switchMap((res) => this.getRequest(res)),
      map((res: any) => this.dataMaping(res, entityName))
    );

    return requestResult;
  };

  getRequest = (res: any) => {
    let entityArray = [
      'shop type',
      'product category',
      'delivery man',
      'shipping status',
      'withdraw status',
      'bank name',
      'promotion type',
      'promotion status',
      'root category',
      'approval status',
      'department',
      'ticket status',
    ];

    if (res == 'shop type') {
      return this._httpClient.get(`${this.mainBaseUrl}shop-types`);
    } else if (res == 'product category') {
      return this._httpClient.get(`${this.mainBaseUrl}categories`);
    } else if (res == 'delivery man') {
      return this._httpClient.get(`${this.userBaseUrl}users/transporter`);
    } else if (res == 'department') {
      return this._httpClient.get(`${this.coreBaseUrl}department`);
    } else if (res == 'shipping status') {
      return of(this.shippingStatusArray);
    } else if (res == 'withdraw status') {
      return of(this.withdrawStatusArray);
    } else if (res == 'promotion type') {
      return of(this.promotionTypeArray);
    } else if (res == 'root category') {
      return of(this.yesNoArray);
    } else if (res == 'approval status') {
      return of(this.approvalArray);
    }
    return of([]);
  };

  dataMaping = (res: any, entityName: string, type: string = 'payload') => {
    let data = [];

    if (type == 'payload') {
      if (res?.payload?.data) {
        data = res.payload.data;
        if (entityName == 'delivery man') {
          data.map((result: any) => {
            result['name'] =
              result.user['firstName'] +
              ' ' +
              result.user['lastName'] +
              ' - ' +
              result.user['phone'];
          });
        } else if (entityName == 'bank name') {
          data.map((result: any) => {
            result['name'] = result['bankName'];
          });
        } else {
        }
      } else {
        data = res;
      }
    } else {
      if (res?.page?.data) {
        data = res.page.data;

        // console.log(data);

        if (entityName == 'merchant' || entityName == 'customer') {
          data.map((result: any) => {
            result['name'] = result['firstName'] + ' ' + result['lastName'];
            result['extra'] = result['email'] + ' - ' + result['phone'];
          });
        } else {
          data.map((result: any) => {
            result['extra'] = '';
          });
        }
      } else {
        data = res;
      }
    }
    return data;
  };
}
