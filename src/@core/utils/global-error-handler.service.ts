import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageType } from '../../@shared/constants/constant';
import { MessageService } from '../../@shared/message/message.service';
import { ErrorService } from '../../@shared/error.service';

@Injectable({
    providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {
    constructor(private injector: Injector) {

    }

    handleError(error: any) {
        const chunkFailedMessage = /Loading chunk [\d]+ failed/;
        if (chunkFailedMessage.test(error.message)) {
            window.location.reload();
        }
        const messageService = this.injector.get(MessageService);
        //const authService = this.injector.get(AuthService);
        const errorService = this.injector.get(ErrorService);
        if (error instanceof HttpErrorResponse) {
            if (!navigator.onLine) {
                return messageService.Message('No Internet Connection', MessageType.error);
            }
            else {
                let serverMessage = errorService.getServerMessage(error)
                let serverStackTrace = errorService.getServerStack(error)
                console.log("Error Message On Server: \n" + serverMessage);
                console.log("Error StackTrace On Server: \n" + serverStackTrace);
                if (error.status == 0) {
                    return messageService.Message('Something went wrong with the server. Please try after sometime.', MessageType.error);

                }

                if (error.status == 401) {
                    messageService.Message(`${error.statusText}`, MessageType.error);
                    //return authService.logout;
                }

                else {
                    return messageService.Message(`${error.status} - ${error.statusText}`, MessageType.error);
                }

            }
        }
        else {
            let clientMessage = errorService.getClientMessage(error);
            let clientStackTrace = errorService.getClientStack(error);
            console.log("Error Message On Client: \n" + clientMessage);
            console.log("Error StackTrace On Client: \n" + clientStackTrace);
            return messageService.Message('Client Error. Please try after sometime.', MessageType.error);
        }

    }
}
