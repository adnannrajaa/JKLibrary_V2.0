import { Injectable } from '@angular/core';
import { UtilsService } from '../utils/utils.service';
import { Observable } from 'rxjs';
import { BaseRequestModel, BaseResponseModel } from '../models';
import { HomeData } from '../data';

@Injectable()
export class HomeService extends HomeData {
  
  constructor(private _utilsServices: UtilsService) {
    super();
  }
  get(request: BaseRequestModel): Observable<BaseResponseModel> {
    return this._utilsServices.postPut<BaseResponseModel>('/web/home/get', request);
  }

}
