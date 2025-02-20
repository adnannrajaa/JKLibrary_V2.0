import { Observable } from 'rxjs';
import {  BaseResponseModel, visitor } from '../../@core/models';
export abstract class AccountData {
  abstract visitor(request: visitor): Observable<BaseResponseModel>;
  abstract visitorIp(request: any): Observable<BaseResponseModel>;
}

