import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subject, takeUntil, takeWhile } from 'rxjs';
import { AccountData, MiscellaneousData } from '../@core/data';
import { CommonService } from '../@shared/common-service.service';
import { IpAddress, visitor } from '../@core/models';
import { LoaderComponent } from '../@shared/components';
import { FooterComponent, TopbarComponent } from './layouts';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  // Private
  private _unsubscribeAll: Subject<any>;
  private alive = true;
  constructor(private _miscellaneousService: MiscellaneousData,
    private _accountService: AccountData,
    private _commonService: CommonService) {
    this._unsubscribeAll = new Subject();
  }
  ngOnInit(): void {
   
    var ipAddress = this._commonService.localStorageGetItem("ipAddress");
    if (this._commonService.isNullOrEmpty(ipAddress)) {
      this.getVisitorIpAddress();
    }
  }
  getVisitorIpAddress() {
    this._miscellaneousService.getIpAddress()
      .pipe(takeWhile(() => this.alive))
      .subscribe((response: IpAddress) => {
        if (!this._commonService.isNullOrEmpty(response?.ip)) {
          this._commonService.localStorageSetItem("ipAddress",response?.ip);
          this.InsertVistorIp(response.ip);
        }
      })
  }
  getVisitorIpDetails(ip: string) {
    this._miscellaneousService.getIpDetails(ip)
      .pipe(takeWhile(() => this.alive))
      .subscribe((response: any) => {
        if (response !== null && response?.status == 'success') {
          this.generateVisitorToken(response);
        }
      })
  }
  InsertVistorIp(ip: string) {
    var obj = {
      IpAddress: ip
    }
    this._accountService.visitorIp(obj)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(result => {
        if (result.success) {
          console.log("Success")
        } else {
          console.log(result.responseMessage);
        }
      });
  }

  generateVisitorToken(visitorInfo: visitor) {
    visitorInfo.ipAddress = visitorInfo.query;
    this._accountService.visitor(visitorInfo)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(result => {
        if (result.success) {
          this._commonService.localStorageSetItem("auth", result.data);
        } else {
          console.log(result.responseMessage);
        }
      });
  }

  ngOnDestroy() {
    this._unsubscribeAll.complete();
    this.alive = false;
  }
}
