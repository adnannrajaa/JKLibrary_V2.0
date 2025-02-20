import { Inject, Injectable } from '@angular/core';
import { UtilsService } from '../utils/utils.service';
import { Observable } from 'rxjs';
import { IpAddress, IpDetails } from '../models';
import { MiscellaneousData } from '../data';
import { environment } from '../../environments/environment';

@Injectable()
export class MiscellaneousService extends MiscellaneousData {
  constructor(private _utilsServices: UtilsService) {
    super();
  }

  getIpAddress(): Observable<IpAddress> {
    return this._utilsServices.getDelete<IpAddress>(null, environment.getIpAddress);
  }
  getIpDetails(ipAddress: string): Observable<IpDetails> {
    return this._utilsServices.getDelete<IpDetails>(null, environment.getIpDetails + ipAddress);
  }
}
