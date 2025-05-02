import { Observable } from 'rxjs';
import {  BaseResponseModel, visitor } from '../../@core/models';
export abstract class AccountData {
  abstract login(user: any, currentScreen: string): Observable<BaseResponseModel>;
  abstract forgotPassword(forgotPassword: any): Observable<BaseResponseModel>;
  abstract resetPassword(resetPassword: any): Observable<BaseResponseModel>;
  abstract changePassword(request: any): Observable<BaseResponseModel>;

  abstract getMFA(): Observable<BaseResponseModel>;
  abstract enableMFA(mfa: any): Observable<BaseResponseModel>;
  abstract refreshToken(): Observable<BaseResponseModel>;

  abstract saveUser(user: any): Observable<BaseResponseModel>;
  abstract updatePersonalInfo(personalInfo: any): Observable<BaseResponseModel>;
  abstract updateAddress(userBio: any): Observable<BaseResponseModel>;

  abstract visitor(request: visitor): Observable<BaseResponseModel>;
  abstract visitorIp(request: any): Observable<BaseResponseModel>;
}

