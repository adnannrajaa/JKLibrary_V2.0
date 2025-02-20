export interface Authenticate {
    email: string;
    password: string;
}
export interface Login {
  token?: string;
  refreshToken?: string;
  data?: boolean;
}

export class ActiveUser {
  UserId: number;
  TenantId: number;
  RoleId: number;
  UserName: string;
  BranchId: number;
  IsAdmin: boolean;
  IsBot: boolean;
  IsExpired: boolean;
  Image: string;
  Role: string;
  constructor() {
    this.UserId = 0;
    this.TenantId = 0;
    this.RoleId = 0;
    this.UserName = "";
    this.BranchId = 0;
    this.IsAdmin = false;
    this.IsBot = false;
    this.IsExpired = true;
    this.Image = "";
    this.Role = "";
  }
}
