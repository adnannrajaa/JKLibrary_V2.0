import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { LoaderService } from './loader.service';
import { ResponseCode } from '../../@shared/constants/constant';
import { CryptographyService } from './cryptography.service';
import { environment } from '../../environments/environment';

@Injectable()
export class HttpHandlerInterceptor implements HttpInterceptor {

  constructor(private _loaderService: LoaderService,
    private _cryptographyService: CryptographyService) { }
  ExcludeURLList = [
    environment.baseUrl + "/api/FileReceiver/FileReceiver",
    environment.baseUrl + "/api/FileReceiver/DownloadFile",
    environment.baseUrl + "/web/FileManager/DownloadFile",

  ];
  ExcludedAdditionalURLs = [
    environment.getIpAddress,
    environment.getIpDetails
  ];
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem("auth")
    // Encrypt request data
    let additionalExcludeFound = this.ExcludedAdditionalURLs.some(element => {
      return request.url.includes(element);
    });
    let baseUrl = additionalExcludeFound == true ? '' : environment.baseUrl;
    let headers = {}; // Define an empty headers object

    if (baseUrl !== '') {
      headers = {
        Authorization: `Bearer ${token}`
      };
    }
    const httpRequest: HttpRequest<any> = request.clone({
      url: baseUrl + request.url,
      setHeaders: headers 
    });
    let exludeFound = this.ExcludeURLList.some(element => {
      return httpRequest.url.includes(element) 
    });

    const encryptedRequest = httpRequest.clone({
      body: exludeFound || additionalExcludeFound ==  true ? httpRequest.body : this._cryptographyService.encryptPayload(httpRequest.body)
    });
    this._loaderService.ShowLoader();
    return next.handle(encryptedRequest).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this._loaderService.HideLoader();
          if (!exludeFound && !additionalExcludeFound) {
            const response = JSON.parse(this._cryptographyService.decryptPayload(event.body));
            if (response != "" || response != null || response.length > 0) {
              if (response.responseCode != ResponseCode.Success) {
                throw new Error(JSON.stringify(response));
              }
            }
            return event.clone({ body: response });
          } else {
            return event;
          }
        }
        else if (event instanceof HttpErrorResponse) {
          this._loaderService.HideLoader();
          throw new Error(event.error);
        }
        return event;
      })
    );
    //return next.handle(encryptedRequest)
    //    .pipe(tap(
    //        req => {
    //            if (req instanceof HttpResponse) {
    //                this._loaderService.HideLoader();
    //                const response = JSON.parse(this._cryptographyService.decryptPayload(req.body));
    //                if (response != "" || response != null || response.length > 0) {
    //                    if (response.responseCode != ResponseCode.Success) {
    //                        throw new Error(JSON.stringify(response));
    //                    }
    //                }
    //                const res = req.clone({ body: response });
    //                debugger;
    //                return res;
    //            }
    //        },
    //        (error: HttpErrorResponse) => {
    //            this._loaderService.HideLoader();
    //            return throwError(error);
    //        }
    //    )
    //    )
  }

}
