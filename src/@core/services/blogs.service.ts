import { Injectable } from '@angular/core';
import { UtilsService } from '../utils/utils.service';
import { Observable } from 'rxjs';
import { BaseRequestModel, BaseResponseModel } from '../models';
import { BlogData } from '../data';

@Injectable()
export class BlogService extends BlogData {

 
  
  constructor(private _utilsServices: UtilsService) {
    super();
  }


  getBlogDetail(id: string): Observable<BaseResponseModel> {
    return this._utilsServices.postPut<BaseResponseModel>('/web/Blog/GetBlogDetail', id);
  }

  saveBlog(blog: any): Observable<BaseResponseModel> {
    return this._utilsServices.postPut<BaseResponseModel>('/web/Blog/SaveBlog', blog);
  }

  getBlogs(request: BaseRequestModel): Observable<BaseResponseModel> {
    return this._utilsServices.postPut<BaseResponseModel>('/web/Blog/GetBlogs', request);
  }
  getBlogsByUser(request: BaseRequestModel, type: string): Observable<BaseResponseModel> {
    if(type === "Draft")
      return this._utilsServices.postPut<BaseResponseModel>('/web/Blog/GetDraftBlogs', request);
    else
      return this._utilsServices.postPut<BaseResponseModel>('/web/Blog/GetPublishedPosts', request);
  }

}
