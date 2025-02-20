import { Observable } from 'rxjs';
import { BaseResponseModel } from '../models';
import { Authenticate } from '../models/user-model';

export abstract class UserData {
  abstract AuthenticateUser(user: any): Observable<BaseResponseModel>;
}
