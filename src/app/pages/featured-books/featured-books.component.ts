import { Component, OnDestroy, OnInit } from '@angular/core';
import { TopbarComponent, FooterComponent } from '../../layouts';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BookData, FileData } from '../../../@core/data';
import { CommonService } from '../../../@shared/common-service.service';
import { BaseRequestModel } from '../../../@core/models';
import { takeWhile } from 'rxjs';


@Component({
  selector: 'app-featured-books',
  standalone: true,
  imports: [CommonModule, TopbarComponent, FooterComponent, RouterModule],
  templateUrl: './featured-books.component.html',
  styleUrl: './featured-books.component.scss'
})
export class FeaturedBooksComponent implements OnInit, OnDestroy {
  //pagination variables 
  pageSizeChanged: number = 50;
  pageNoChanged: number = 1;
  searchText: string = '';
  showPagination: boolean = false;

  error = "";
  books: any[] = [];
  recommendedBooks: any[] = [];
  haveBooks: boolean = false;
  private alive = true;
  constructor(private route: ActivatedRoute,
    private _bookService: BookData,
    private _fileService: FileData,
    private _commonService: CommonService) {

  }
  ngOnInit(): void {
    this.loadBooksTbl(new BaseRequestModel());
  }
  getCompletePath(imageurl) {
    return this._commonService.getCompletePath(imageurl);
  }
  downloadFile(book: any) {
    this._fileService.downloadFile(book.url, book.id, book.originalBookName).
      subscribe(response => {
        if (response?.state == "DONE") {
          console.log("File downloaded");
        }
      });
  }
  loadBooksTbl(request: BaseRequestModel) {
    this._bookService.get(request)
      .pipe(takeWhile(() => this.alive))
      .subscribe((response) => {
        if (response.success) {
          this.books = response.data?.items;
          if (this.books.length > 0) {
            this.books.map(s => {
              s.displayCoverPage = this.getCompletePath(s.displayCoverPage);
              s.discount = 0;
              this.recommendedBooks.push(s);
              return s;
            });
            this.haveBooks = true;
            this.showPagination = true;
          }
          else {
            this.haveBooks = false;
            this.showPagination = false;
          }
        } else {
          //this._messageService.Message(response.responseMessage, MessageType.error);
        }

      })

  }
  reloadBooksTbl(callFrom: string, event: any) {
    switch (callFrom) {
      case 'pageSizeChanged':
        this.pageSizeChanged = event;
        this.pageNoChanged = 1;
        break;
      case 'search':
        this.searchText = event;
        this.pageNoChanged = 1;
        break;
      case 'pagination':
        this.pageNoChanged = event;
        break;
    }
    var obj = new BaseRequestModel(this.pageNoChanged, this.pageSizeChanged, this.searchText);
    this.loadBooksTbl(obj)


  }
  ngOnDestroy(): void {
    this.alive = false;
  }

}
