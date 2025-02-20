import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { DOCUMENT } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class LoaderService {

    private loadCount: number = 0;
    loadState: BehaviorSubject<boolean> = new BehaviorSubject(false);
    constructor() { }

    ShowLoader() {
        //this.document.querySelector('.app-content').classList.add('show-overlay');
        this.loadCount += 1;
        this.loadState.next(true);
    }

    HideLoader() {
        this.loadCount = (this.loadCount ? --this.loadCount : 0);
        if (!this.loadCount) this.loadState.next(false);
        //this.document.querySelector('.app-content').classList.remove('show-overlay');

    }
}
