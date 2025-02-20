import { Observable } from 'rxjs';
import { BaseRequestModel, BaseResponseModel } from '../../@core/models';
export abstract class StaticPagesData {
    abstract getAboutUs(): Observable<BaseResponseModel>;
    abstract getLegal(): Observable<BaseResponseModel>;
    abstract saveContactUs(contactUs: any): Observable<BaseResponseModel>;

}

