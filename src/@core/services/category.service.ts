import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CategoryData } from '../data';
import { BaseResponseModel, BaseRequestModel } from '../models';
import { UtilsService } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends CategoryData {
  constructor(private _utilsServices: UtilsService) {
    super();
  }
  getCategoryDDL(type: number): Observable<BaseResponseModel> {
    var request = {
      categoryType: type
    };
    return this._utilsServices.postPut<BaseResponseModel>('/web/Category/CategoryDDL', request);
  }
  getBookCategories(): Observable<BaseResponseModel> {
    return this._utilsServices.postPut<BaseResponseModel>('/web/Category/BookCategories', new BaseRequestModel());
;
  }
  getCategories(request: BaseRequestModel): Observable<BaseResponseModel> {
    return this._utilsServices.postPut<BaseResponseModel>('/web/Category/GetCategories', request);
  }
 
}
