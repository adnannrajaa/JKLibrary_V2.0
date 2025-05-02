export interface visitor {
  ipAddress: string
  country: string,
  countryCode: string,
  region: string,
  regionName: string,
  city: string,
  zip: string,
  lat: number,
  lon: number,
  timezone: string,
  isp: string,
  org: string,
  as: string,
  query: string
}


export class MFA {
  authenticatorUri: string
  code: string
  sharedKey: string
}


export class User {
  id: string;
  storeId: number;
  tenantId: number;
  store: string;
  vendor: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  contact: string;
  image: string;
  roleId: number;
  isLocked: boolean;
  isVerified: boolean;
  role: string;

}
export class ActiveUser {
  UserId: string;
  FirstName: string;
  LastName: string;
  FullName: string;
  IsAdmin: boolean;
  IsExpired: boolean;
  Avatar: string;
  IsMFAEnabled: boolean;
  constructor() {
    this.UserId = "";
    this.FirstName = "";
    this.LastName = "";
    this.FullName = "";
    this.IsMFAEnabled = false;
    this.IsAdmin = false;
    this.Avatar = "";
    this.IsExpired = true;
  }
}
