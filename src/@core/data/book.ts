import { Observable } from 'rxjs';
import { BaseRequestModel, BaseResponseModel } from '../../@core/models';
export abstract class BookData {
  abstract get(request: BaseRequestModel): Observable<BaseResponseModel>;
  abstract sendBook(book: any): Observable<BaseResponseModel>;
}

