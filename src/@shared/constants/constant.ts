export class RegexpPattern {
    public static phoneNumber = /^\d{4}[- ]?\d{7}$/;
    public static landLine = /^\d{3}[- ]?\d{7}$/;
    public static BarcodeMinLength = /^[a-zA-Z0-9_.]{3,}$/;
}

export const StrongPasswordRegx: RegExp =
  /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;
export enum Extensions {
    image = 'jpg,png,jpeg',
    excel = 'xlsx,xls',
  pdf = 'pdf',
  video = 'mp4,avi,mov'
}
export enum Size {
    image = 800, //KB,
  excel = 10, //MB
    pdf = 400 //MB
}

export enum FileType {
  image = 'Image',
  pdf = "Pdf",
  excel = "excel",
  video = "Video",
}

export enum AuthScreen {
  Login = "1",
  MFA = "2",
  RecoveryCodes = "3"
}

export enum SizeUnit {
    KB = "KB",
    MB = "MB",
    GB = "GB"
}

export enum MessageType {
  success = 'Success',
  warning = 'Warning',
  info = 'Info',
  error = "Error"
}
export enum BookAction {
    Pin = 1,
    Unpin = 2,
    Recommanded = 3,
    Reviewed = 4,
    Delete = 5
}
export enum FileStatus {
    Browse,
    FileBrowsed,
    Uploading,
    UploadedSuccess,
    UploadFaild,
}

export enum CategoryType {
  Book = 1,
  Interview = 2,
  Blog = 3,
}

export enum ResponseMessage {
    NoContent = "Record not found",
    Error = "An error occurred",
    Success = "Success",
    Added = "Record saved successfully",
    Updated = "Record updated successfully",
    Deleted = "Record deleted successfully",
    InsufficentBalance = "You do not have sufficent balance in your account!",
}

export enum PaymentMethod {
    cash = "Cash",
    bankAccount = "Bank Account",
    cashOnDelievry = "Cash On Delievry",
    online = "Online",
}

export enum TransactionType {
    withdraw = "Withdraw",
    deposit = "Deposit",
}

export enum DebitorType {
    client = "Client",
    customer = "Customer",
    properiter = "Properiter",
    supplier = "Supplier",
}

export enum DefaultUploads {
    InventoryFile = "Inventory File",
    PaymentFile = "Payment File",
}

export enum EncrypationKey {
    Value = "THIS IS MY SECRET KEY",
}
export enum ModalState {
    Open = "Open",
    Closed = "Closed",
}
export enum SessionStatus {
    NotStarted = "Not Started",
    Closed = "Closed",
    Active = "Active",
    Pause = "Pause",
    Resume = "Resume"
}
export enum PayloadCryptography {
    Key = "9qfGHcg0NlMac9pJr7phX6J=",
    IV = "vsuBiyBMi1xGEO==",
}
export enum DateTimeFormat {
    DefaultTimeFormat = "hh:mm A",
    DefaultDateFormat = "MMM DD, YYYY",
    DefaultDateTimeFormat = "MMM DD, YYYY hh:mm A"
}
export enum ResponseCode {
    Default = "00",
    Success = "200",
    Fail = "02",
    Exception = "500",
    Validation = "04"
}

interface TimeZones {
  Key: string,
  Value: string
}


