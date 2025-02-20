import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../@core/utils';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  show: boolean = false;
  constructor(private _loaderService: LoaderService) { }

    ngOnInit() {
        this._loaderService.loadState.subscribe(res => {
      this.show = res;
    });
  }
}
