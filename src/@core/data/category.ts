import { Observable } from 'rxjs';
import { BaseRequestModel, BaseResponseModel } from '../../@core/models';
export abstract class CategoryData {
    abstract getCategoryDDL(categoryType: number): Observable<BaseResponseModel>;
    abstract getBookCategories(): Observable<BaseResponseModel>;
    abstract getCategories(request: BaseRequestModel): Observable<BaseResponseModel>;
}

