import { Injectable } from '@angular/core';
import { UtilsService } from '../utils/utils.service';
import { UserData } from '../data/users';
import { Authenticate, Login } from '../models/user-model';
import { Observable } from 'rxjs';
import { BaseResponseModel } from '../models';

@Injectable()
export class UserService extends UserData {
  constructor(private _utilsServices: UtilsService) {
    super();
  }
  AuthenticateUser(user: any): Observable<BaseResponseModel> {
    return this._utilsServices.postPut<BaseResponseModel>('/api/Account/Login', user);
  }

}
