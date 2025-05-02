import { Injectable } from '@angular/core';
import { UtilsService } from '../utils/utils.service';
import { Observable } from 'rxjs';
import { BaseRequestModel, BaseResponseModel, visitor } from '../models';
import { AccountData } from '../data';
import { AuthScreen } from '../../@shared/constants/constant';

@Injectable()
export class AccountService extends AccountData {
  
  constructor(private _utilsServices: UtilsService) {
    super();
  }
  login(user: any, currentScreen: string): Observable<BaseResponseModel> {

    if (currentScreen == AuthScreen.RecoveryCodes) {
      return this._utilsServices.postPut<BaseResponseModel>('/api/account/LoginWithRecoveryCode', user);
    }
    else {
      return this._utilsServices.postPut<BaseResponseModel>('/api/account/login', user);

    }
  }
  forgotPassword(forgetPassword: any): Observable<BaseResponseModel> {
    return this._utilsServices.postPut<BaseResponseModel>('/api/Account/ForgotPassword', forgetPassword);
  }
  resetPassword(resetPassword: any): Observable<BaseResponseModel> {
    return this._utilsServices.postPut<BaseResponseModel>('/api/Account/ResetPassword', resetPassword);
  }
  changePassword(request: any): Observable<BaseResponseModel> {
    return this._utilsServices.postPut<BaseResponseModel>('/api/Account/ChangePassword', request);
  }

  getMFA(): Observable<BaseResponseModel> {
    return this._utilsServices.postPut<BaseResponseModel>('/api/Account/GetMFA', new BaseRequestModel());
  }
  enableMFA(mfa: any): Observable<BaseResponseModel> {
    return this._utilsServices.postPut<BaseResponseModel>('/api/account/EnableAuthenticator', mfa);
  }
  refreshToken(): Observable<BaseResponseModel> {
    throw new Error('Method not implemented.');
  }


  saveUser(user: any): Observable<BaseResponseModel> {
    return this._utilsServices.postPut<BaseResponseModel>('/api/user/SaveUser', user);
  }

  updatePersonalInfo(personalInfo: any): Observable<BaseResponseModel> {
    return this._utilsServices.postPut<BaseResponseModel>('/api/User/UpdatePersonalInfo', personalInfo);
  }
 
  updateAddress(address: any): Observable<BaseResponseModel> {
    return this._utilsServices.postPut<BaseResponseModel>('/api/User/UpdateAddress', address);
  }

  

  visitor(request: visitor): Observable<BaseResponseModel> {
    return this._utilsServices.postPut<BaseResponseModel>('/api/account/visitor', request);
  }
  visitorIp(request: any): Observable<BaseResponseModel> {
    return this._utilsServices.postPut<BaseResponseModel>('/api/account/VisitorIp', request);
  }
}
