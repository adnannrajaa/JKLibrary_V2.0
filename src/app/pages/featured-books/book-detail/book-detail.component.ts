import { Component, OnDestroy, OnInit } from '@angular/core';
import { FooterComponent, TopbarComponent } from '../../../layouts';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { takeWhile } from 'rxjs';
import { BookData, FileData } from '../../../../@core/data';
import { CommonService } from '../../../../@shared/common-service.service';
import { BaseRequestModel } from '../../../../@core/models';
import { CommonModule } from '@angular/common';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';



@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, TopbarComponent, FooterComponent, RouterModule, NgxExtendedPdfViewerModule],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.scss'
})
export class BookDetailComponent implements OnInit, OnDestroy {
  //pagination variables 
  pageSizeChanged: number = 50;
  pageNoChanged: number = 1;
  searchText: string = '';
  showPagination: boolean = false;

  error = "";
  books: any[] = [];
  haveBooks: boolean = false;

  bookId: string;
  bookDetail: any;
  comments: any;
  private alive = true;
  pdfSrc: string ;
  constructor(private route: ActivatedRoute,
    private _bookService: BookData,
    private _fileService: FileData,
    private _commonService: CommonService) {

  }

  ngOnInit() {
    this.bookId = this.route.snapshot.paramMap.get('id');
    this._commonService.isNullOrEmpty(this.bookId) ? "" : this.getBookDetail(this.bookId)
    this.loadBooksTbl(new BaseRequestModel());
  }
  getCompletePath(imageurl) {
    return this._commonService.getCompletePath(imageurl);
  }
  getBookDetail(id: string) {
    this._bookService.getBookDetail(id)
      .pipe(takeWhile(() => this.alive))
      .subscribe((response) => {
        if (response.success) {
          this.bookDetail = response.data;
          this.bookDetail.displayCoverPage = this.getCompletePath(this.bookDetail.displayCoverPage);
          
          if (this.bookDetail.comments?.length > 0) {
            this.comments = this.buildCommentTree(this.bookDetail.comments);
          }
          this.getPdf(this.bookDetail);
        } else {
          this.error = response.responseMessage;
        }
      })
  }
  getPdf(book: any) {
    this._fileService.getPdfFile(book.url).
      subscribe(response => {
        this.pdfSrc = response;
        console.log(response);
      });
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
  buildCommentTree(comments: any): any {
    const commentDictionary: { [key: string]: any } = {};
    const rootComments: any = [];

    // Create a dictionary with commentId as key
    for (const comment of comments) {
      commentDictionary[comment.id] = comment;
    }

    // Iterate through comments and add them as children to their respective parent
    for (const comment of comments) {
      if (comment.parentId && commentDictionary[comment.parentId]) {
        const parentComment = commentDictionary[comment.parentId];
        if (!parentComment.children) {
          parentComment.children = [];
        }
        parentComment.children.push(comment);
      } else {
        rootComments.push(comment);
      }
    }

    return rootComments;
  }
  ngOnDestroy(): void {
    this.alive = false;
  }

}
