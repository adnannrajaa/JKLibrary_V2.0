import { Injectable } from '@angular/core';
import { UtilsService } from '../utils/utils.service';
import { Observable } from 'rxjs';
import { BaseResponseModel, visitor } from '../models';
import { AccountData } from '../data';

@Injectable()
export class AccountService extends AccountData {
  
  constructor(private _utilsServices: UtilsService) {
    super();
  }
  visitor(request: visitor): Observable<BaseResponseModel> {
    return this._utilsServices.postPut<BaseResponseModel>('/api/account/visitor', request);
  }
  visitorIp(request: any): Observable<BaseResponseModel> {
    return this._utilsServices.postPut<BaseResponseModel>('/api/account/VisitorIp', request);
  }
}
