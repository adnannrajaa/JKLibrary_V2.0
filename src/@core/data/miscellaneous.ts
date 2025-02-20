import { Observable } from 'rxjs';
import { IpAddress, IpDetails } from '../models';
export abstract class MiscellaneousData {
  //return Current User IP Address
  abstract getIpAddress(): Observable<IpAddress>;
  //return Current User IP Information
  abstract getIpDetails(ipAddress: string): Observable<IpDetails>;
}

