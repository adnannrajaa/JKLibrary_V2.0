import { Injectable } from '@angular/core';
//import { ToastrService } from 'ngx-toastr';
import { MessageType } from '../constants/constant';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  //private _toastrService: ToastrService
  constructor() { }
  Message(text: string, type: string, closebutton?: boolean, timeSpan?: number) {
    if (type == MessageType.success) {
        //this._toastrService.success(text, type, { closeButton: closebutton = true, timeOut: timeSpan = 3000, toastClass: 'toast ngx-toastr' })
    }
    else if (type == MessageType.error) {
        //this._toastrService.error(text, type, { closeButton: closebutton = true, timeOut: timeSpan = 3000, toastClass: 'toast ngx-toastr'  })
    }
    else if (type == MessageType.warning) {
        //this._toastrService.warning(text, type, { closeButton: closebutton = true, timeOut: timeSpan = 3000, toastClass: 'toast ngx-toastr' })
    }
    else if (type == MessageType.info) {
        //this._toastrService.info(text, type, { closeButton: closebutton = true, timeOut: timeSpan = 3000, toastClass: 'toast ngx-toastr'  })
    }
  }
}
