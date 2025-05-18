import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FileData } from '../data/file';
import { Download, Upload } from '../models';
import { UtilsService } from '../utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class FileService extends FileData {
  
  constructor(private _utilsServices: UtilsService
  ) { super(); }
  uploadFile(event: any): Observable<Upload> {
    if (event != undefined) {
      var files = event.srcElement.files;
      if (files == undefined && files == null) {
        return new Observable<Upload>();
      }
      return this._utilsServices.uploadFile("/api/FileReceiver/FileReceiver", files);

    } else {
      return new Observable<Upload>();
    }
  }
  downloadFile(filePath: string, bookId:string,fileName?: string, ): Observable<Download> {
    return this._utilsServices.downloadFile(filePath, bookId, fileName);
  }
  getPdfFile(filePath: string): Observable<string> {
    return this._utilsServices.loadPdf<string>("/web/FileManager/" + filePath);
  }
}
