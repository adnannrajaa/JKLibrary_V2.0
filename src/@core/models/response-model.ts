export class BaseResponseModel {
  data: any
  responseCode: string = ""
  responseMessage: string = ""
  success: boolean = false;
  responseExecutionTime: string = ""
  errors: ErrorModel[] = []
}
export class ErrorModel {
    errorCode: string
    errorMessage: string
    constructor(ErrorCode: string, ErrorMessage: string) {
        this.errorCode = ErrorCode;
        this.errorMessage = ErrorMessage;
    }
}


