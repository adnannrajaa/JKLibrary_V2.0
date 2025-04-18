import { DOCUMENT, DatePipe, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, concat } from 'rxjs';
import { environment } from '../environments/environment';
import { CryptographyService } from '../@core/utils/cryptography.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public currentData: any;
  public editData: BehaviorSubject<any>;
  private isBrowser: boolean;

  constructor(
    public datepipe: DatePipe,
    public _cryptographyService: CryptographyService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.editData = new BehaviorSubject({});
    this.isBrowser = isPlatformBrowser(platformId);
  }

  getCompletePath(filePath: string, clientSide: boolean = false): string | null {
    let completePath = null;
    if (this.isNullOrEmpty(filePath))
      return "";
    var plainURL = this.decryptImageUrl(filePath);
    plainURL = plainURL.replace("//", "/");
    plainURL = plainURL.replace("\\", "/");
    //if client side false mean file is on file server
    if (clientSide == false) {
      completePath = environment.fileServer + "/" + plainURL;
    } else if (clientSide == true) {
      completePath = environment.fileServer + "/" + plainURL;
    }
    return completePath;
  }
  decryptImageUrl(url: any): string  {
      return this._cryptographyService.decryptImageURL(url);
  }

  localStorageSetItem(key: any, value: any) {
    if (this.isBrowser && localStorage) {
      localStorage.setItem(key, value);
    }
  }

  localStorageGetItem(key: any): any {
    if (this.isBrowser && localStorage) {
      return localStorage.getItem(key);
    }
    return null;
  }

  isNullOrEmpty(obj: any): boolean {
    if (obj == null || obj == undefined || Number.isNaN(obj) || obj == "" || obj == "0001-01-01T00:00:00") {
      return true;
    }
    return false;
  }
  parseToString(obj: any): any {
    if (obj == null || obj == undefined || Number.isNaN(obj) || obj == "") {
      return null;
    }
    return obj.trim().toString();
  }
  parseToNumber(obj: any): number {
    if (obj == null || obj == undefined || Number.isNaN(obj) || obj == "") {
      return 0;
    }
    return parseFloat(obj);
  }
  sqlDateFormat(date: Date) {
    return this.datepipe.transform(date, 'yyyy/MM/dd');
  }
  get getPreviousYear() {
    const thisYear = (new Date()).getFullYear();
    const lastYear = thisYear - 1;
    return lastYear;
  }
  get getLastMonth() {
    let currentDate = new Date();
    currentDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
    let month = currentDate.getMonth();
    let year = currentDate.getFullYear();
    let days = this.getdaysInMonth(month, year);

    let from = year + "-" + month + "-" + "01";
    let to = year + "-" + month + "-" + days;
    let dateRange = this.sqlDateFormat(new Date(from)) + " - " + this.sqlDateFormat(new Date(to));
    return dateRange;
  }
  get getLast30Days() {
    let currentDate = new Date();
    currentDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
    let from = currentDate;
    let to = new Date();
    let dateRange = this.sqlDateFormat(new Date(from)) + " - " + this.sqlDateFormat(new Date(to));
    return dateRange;
  }
  get getLastYear() {
    let currentDate = new Date();
    currentDate = new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));
    let year = currentDate.getFullYear();
    let from = year + "-01-01";
    let to = year + "-12-31";
    let dateRange = this.sqlDateFormat(new Date(from)) + " - " + this.sqlDateFormat(new Date(to));
    return dateRange;
  }
  getdaysInMonth(month: any, year: any) {
    return new Date(year, month, 0).getDate();
  }
  //getmonth(year) {
  //    return new Date(year, 0).getMonth();
  //}
  get getCurrentYear() {
    const thisYear = (new Date()).getFullYear();
    return thisYear;
  }
  stringToBoolean(string: string): boolean {
    string = string?.toString();
    switch (string?.toLowerCase().trim()) {
      case "true": case "yes": case "1": return true;
      case "false": case "no": case "0": case null: return false;
      default: return Boolean(string);
    }
  }
  isValidPhoneNumber(phoneNumber: string): boolean {
    var phoneNumberRegex = /^\d{4}[-]?\d{7}$/
    if (phoneNumberRegex.test(phoneNumber)) {
      // Successful match
      return true;
    }
    return false;
  }
  /**
* Create New Todo
*/
  addRecord() {
    this.currentData = {};
    this.editData?.next(this.currentData);
  }

  /**
   * Set Current Todo
   *
   * @param id
   */
  editRecord(item: any) {
    this.currentData = item;
    this.editData?.next(this.currentData);
  }
}



