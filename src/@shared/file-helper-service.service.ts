import { Injectable } from "@angular/core";
import { Extensions, FileType, Size } from "./constants/constant";

@Injectable({
    providedIn: 'root'
})
export class FileHelper {
    getUploadFileName(event: any): string {
        let filesName = "";
        if (event != undefined) {
            for (let i = 0; i < event.srcElement.files.length; i++) {
                filesName += event.srcElement.files[i].name + ",";
            }
        }
        return filesName != "" ? filesName.substr(0, filesName.length - 1) : "";
    }
    getExtention(event: any): string {
        let fileName = this.getUploadFileName(event);
        let extention = fileName.substring(fileName.lastIndexOf('.') + 1);
        return extention.trim().toLowerCase();
    }
    getSize(event: any, sizeUnit: string = "KB" || "MB" || "GB"): number {
        let fileSize = 0;
        switch (sizeUnit) {
            case 'KB':
                fileSize = event.target.files[0].size / 1024; // Size in KB
                break;
            case 'MB':
                fileSize = event.target.files[0].size / 1024 / 1024; // Size in MB
                break;
            case 'GB':
                fileSize = event.target.files[0].size / 1024 / 1024 / 1024; // Size in GB
                break;
            default:
                fileSize = event.target.files[0].size / 1024; // Size in KB
                break;
        }
        return fileSize;

    }
  isValidFile(event: any, fileType: string): boolean {

    var isValid = false;
    var extension = this.getExtention(event);
    switch (fileType) {
      case FileType.image:
        let imgExt = Extensions.image.split(',');
        imgExt.forEach(ex => {
          if (ex.toLowerCase() == extension) {
            isValid = true;
            return isValid;
          }
        })
        break;
      case FileType.pdf:
        let pdfExt = Extensions.pdf.split(',');
        pdfExt.forEach(ex => {
          if (ex.toLowerCase() == extension) {
            isValid = true;
            return isValid;
          }
        })
        break;
      case FileType.excel:
        let excelExt = Extensions.excel.split(',');
        excelExt.forEach(ex => {
          if (ex.toLowerCase() == extension) {
            isValid = true;
            return isValid;
          }
        })
        break;
      case FileType.video:
        let videoExt = Extensions.video.split(',');
        videoExt.forEach(ex => {
          if (ex.toLowerCase() == extension) {
            isValid = true;
            return isValid;
          }
        })
        break;
    }
    return isValid;
  }
    isValidSize(event: any, fileType: string, sizeUnit: string = "KB" || "MB" || "GB"): boolean {

        var isValid = false;
        var fileSize = this.getSize(event, sizeUnit);
        switch (fileType) {
            case FileType.image:
                let imgSize = Size.image;
                fileSize <= imgSize ? isValid = true : isValid
                break;
            case FileType.excel:
                let excelSize = Size.excel;
                fileSize <= excelSize ? isValid = true : isValid
                break;
        }
        return isValid;
    }
}
