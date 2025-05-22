import { Observable } from 'rxjs';
import {  BaseRequestModel, BaseResponseModel, visitor } from '../../@core/models';
export abstract class BlogData {

  abstract getBlogs(request: BaseRequestModel): Observable<BaseResponseModel>;
  abstract getBlogsByUser(request: BaseRequestModel, type: string): Observable<BaseResponseModel>;
  abstract saveBlog(blog: any): Observable<BaseResponseModel>;
  abstract getBlogDetail(id: string): Observable<BaseResponseModel>;

}

