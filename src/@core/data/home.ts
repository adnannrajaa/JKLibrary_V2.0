import { Observable } from 'rxjs';
import { BaseRequestModel, BaseResponseModel } from '../../@core/models';
export abstract class HomeData {
  abstract get(request: BaseRequestModel): Observable<BaseResponseModel>;
}

