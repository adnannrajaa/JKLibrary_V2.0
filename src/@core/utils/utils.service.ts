import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpProgressEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Download, Upload } from '../models';
import { map, scan } from 'rxjs/operators';
import { SAVER, Saver } from '../saver.provider';
import { CommonService } from '../../@shared/common-service.service';
import { Router } from '@angular/router';


interface QueryParams {
  [key: string]: string | number;
}

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  constructor(private http: HttpClient,
    private _commonService: CommonService,
    private router: Router,
    @Inject(SAVER) private save: Saver) {
  }
  /**
   *
   * * the user here can pass the return type
   *      e.g : this.serviec.getRemove<_TYPE_>(....)
   * * if the user dose not provide an id this will just get all
   * resources for a specific route
   * * this will work on get and delete request with query params filtering
   */

  getDelete<returnType>(id: number | null, route: string,
    qp: QueryParams = {},
    method: 'get' | 'delete' = 'get'
  ): Observable<returnType> {
    const cfqu = this.correctFormatForQueryUrl(qp);
    const httpAny: any = this.http;
    return httpAny[method](`${route}${id ? '/' + id : ''}${cfqu}`

    ) as Observable<returnType>;
  }
  /**
   * this method will patch or post to any route
   * you choose
   */
  postPut<returnType>(
    route: string,
    data: any,
    id: number = 0,
    method: 'post' | 'put' = 'post',
    qp: QueryParams = {}
  ): Observable<returnType> {

    const cfqu = this.correctFormatForQueryUrl(qp);
    return this.http[method](
      `${route}${id ? '/' + id : ''}${cfqu}`,
      data,
      { responseType: 'json' }
    ) as Observable<returnType>;
  }
  loadPdf<T = string>(filePath: string): Observable<T> {
    let customHeaders = new HttpHeaders();
    customHeaders = customHeaders.set('FilePath', filePath);
    return this.http.get('/web/FileManager/ReadPdf', {
      headers: customHeaders,
      responseType: 'blob',
      reportProgress: true
    }).pipe(
      map(blob => URL.createObjectURL(blob) as unknown as T)
    );
  }
  uploadFile(url: string, files: File[]): Observable<Upload> {

    var formData = new FormData();
    Array.from(files).forEach(file => formData.append('file', file))
    return this.http.post(url, formData, {
      reportProgress: true,
      observe: 'events',
      responseType: 'json'
    }).pipe(this.upload())
  }
  downloadFile(filePath: string, bookId: string, filename?: string): Observable<Download> {
    let customHeaders = new HttpHeaders();
    customHeaders = customHeaders.set('FilePath', filePath);
    customHeaders = customHeaders.set('FileId', bookId);
    customHeaders = customHeaders.set('IpAddress', localStorage.getItem("ipAddress") || "");
    return this.http.get('/web/FileManager/DownloadFile', {
      headers: customHeaders,
      reportProgress: true,
      observe: 'events',
      responseType: 'blob'
    }).pipe(this.download(blob => this.save(blob, filename)))
  }


  /**
   * In the return we will attach the '?' if the user provides a query params
   * and if the user provides a null we do not need to map the array to
   * anything, we just simply returns ''.
   * if there qp dose has some keys an values
   * e.g
   * const z = {userId: 1, name: 'rowad'} then
   * this method will return ["userId=1", "name=rowad"]
   */
  private correctFormatForQueryUrl(qp: QueryParams): string {
    if (this._commonService.isNullOrEmpty(qp)) {
      return '';
    }
    const qpAsStr = this.mapQueryParamsToUrl(qp);
    return qpAsStr.length === 0 ? '' : `?${qpAsStr.join('&')}`;
  }

  /**
   * e.g :
   * const z = {userId: 1, name: 'rowad'} then
   * this method will return ["userId=1", "name=rowad"]
   */
  private mapQueryParamsToUrl(qp: QueryParams): Array<string> {
    return Object.keys(qp).map((key: string) => {
      return `${key}=${qp[key]}`;
    });
  }


  private isHttpResponse<T>(event: HttpEvent<T>): event is HttpResponse<T> {
    return event.type === HttpEventType.Response
  }

  private isHttpProgressEvent(event: HttpEvent<unknown>): event is HttpProgressEvent {
    return event.type === HttpEventType.DownloadProgress
      || event.type === HttpEventType.UploadProgress
  }

  private upload(): (source: Observable<HttpEvent<unknown>>) => Observable<Upload> {
    return (source: Observable<HttpEvent<unknown>>) =>
      source.pipe(
        scan((previous: Upload, event: HttpEvent<unknown>): Upload => {
          if (this.isHttpProgressEvent(event)) {
            return {
              progress: event.total
                ? Math.round((100 * event.loaded) / event.total)
                : previous.progress,
              state: 'IN_PROGRESS',
              content: null
            }
          }
          if (this.isHttpResponse(event)) {
            return {
              progress: 100,
              state: 'DONE',
              content: event.body
            }
          }
          return previous
        },
          { state: 'PENDING', progress: 0, content: null }
        )
      )
  }

  private download(saver?: (b: Blob) => void): (source: Observable<HttpEvent<Blob>>) => Observable<Download> {
    return (source: Observable<HttpEvent<Blob>>) =>
      source.pipe(
        scan((previous: Download, event: HttpEvent<Blob>): Download => {
          if (this.isHttpProgressEvent(event)) {
            return {
              progress: event.total
                ? Math.round((100 * event.loaded) / event.total)
                : previous.progress,
              state: 'IN_PROGRESS',
              content: null
            }
          }
          if (this.isHttpResponse(event)) {
            if (saver && event.body) {
              saver(event.body)
            }
            return {
              progress: 100,
              state: 'DONE',
              content: event.body
            }
          }
          return previous
        },
          { state: 'PENDING', progress: 0, content: null }
        )
      )
  }

}
