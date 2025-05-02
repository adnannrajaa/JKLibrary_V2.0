import { Injectable } from '@angular/core';
import { UtilsService } from '../utils/utils.service';
import { Observable } from 'rxjs';
import { BaseRequestModel, BaseResponseModel } from '../models';
import { BookData } from '../data/book';

@Injectable()
export class BookService extends BookData {
  
  constructor(private _utilsServices: UtilsService) {
    super();
  }
  get(request: BaseRequestModel): Observable<BaseResponseModel> {
    return this._utilsServices.postPut<BaseResponseModel>('/web/book/get', request);
  }
  sendBook(book: any): Observable<BaseResponseModel> {
    return this._utilsServices.postPut<BaseResponseModel>('/web/Book/SaveBook', book);
  }



}
