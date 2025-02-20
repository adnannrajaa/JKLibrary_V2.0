import { Component, OnInit } from '@angular/core';
import { Subject, takeWhile } from 'rxjs';
import { FileData, HomeData, MiscellaneousData } from '../../../@core/data';
import { CommonService } from '../../../@shared/common-service.service';
import { BaseRequestModel } from '../../../@core/models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent, TopbarComponent } from '../../layouts';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TopbarComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  // Subscription 
  private alive = true;
  private destroy$: Subject<void> = new Subject<void>();

  //Listing Models
  books: any[] = [];
  banners: any[] = [];

  constructor(private _homeService: HomeData,
    private _commonService: CommonService,
    private _miscellaneousService: MiscellaneousData,
    private _fileService: FileData
  ) {

  }
  ngOnInit(): void {
    var request = new BaseRequestModel()
    request.pageSize = 4;
    this.loadHomeData(request);
  }
  loadHomeData(request: BaseRequestModel) {
    this._homeService.get(request)
      .pipe(takeWhile(() => this.alive))
      .subscribe((response) => {
        if (response.success) {
          this.books = response?.data?.books
          this.banners = response?.data?.banners
          if (this.books != null && this.books?.length > 0) {
            this.books.map(s => {
              s.coverPage = this._commonService.getCompletePath(s.coverPage);
              return s;
            });
          }
          if (this.banners != null && this.banners?.length > 0) {
            this.banners.map(s => {
              s.displayBGImage = this._commonService.getCompletePath(s.displayBGImage);
              return s;
            });
          }
          console.log(this.books)
          console.log(this.banners)
        }
      })
  }
  downloadFile(book: any) {
    this._fileService.downloadFile(book.url, book.id, book.originalBookName).
      subscribe(response => {
        if (response?.state == "DONE") {
          console.log("File downloaded");
        }
      });
  }
  interview: any[] = [
    {
      'bookname': '50 Shades of Gray'
    },
    {
      'bookname': 'Harry Potter'
    },
    {
      'bookname': 'Game Of Throns'
    },
    {
      'bookname': '50 Shades of Gray'
    },
  ]
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.alive = false;
  }
}

