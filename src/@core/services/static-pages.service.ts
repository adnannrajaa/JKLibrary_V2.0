import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BookData, StaticPagesData } from '../data';
import { BaseResponseModel, BaseRequestModel } from '../models';
import { UtilsService } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class StaticPagesService extends StaticPagesData {

  constructor(private _utilsServices: UtilsService) {
    super();
  }
  getAboutUs(): Observable<BaseResponseModel> {
    return this._utilsServices.getDelete<BaseResponseModel>(null, '/web/StaticPages/GetAboutUs');
  }
  getLegal(): Observable<BaseResponseModel> {
    return this._utilsServices.getDelete<BaseResponseModel>(null, '/web/StaticPages/GetLegal');
  }
  saveContactUs(contactUs: any): Observable<BaseResponseModel> {
    return this._utilsServices.postPut<BaseResponseModel>('/web/StaticPages/SaveContactUs', contactUs);
  }
}
