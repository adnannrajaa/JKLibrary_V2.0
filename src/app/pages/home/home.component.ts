import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil, takeWhile } from 'rxjs';
import { BookData, CategoryData, FileData, HomeData, MiscellaneousData } from '../../../@core/data';
import { CommonService } from '../../../@shared/common-service.service';
import { BaseRequestModel, BaseResponseModel, FileReceiverResult, MiscellaneousDDL } from '../../../@core/models';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FooterComponent, TopbarComponent } from '../../layouts';
import { FileHelper } from '../../../@shared/file-helper-service.service';
import { FileType, MessageType, SizeUnit, Size, CategoryType } from '../../../@shared/constants/constant';
import { NgbAlert, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { SwiperService } from '../../../@shared/Services';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,TopbarComponent, FooterComponent, FormsModule, ReactiveFormsModule, NgbAlert, RouterModule, NgbPagination],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})  
export class HomeComponent implements OnInit {
  // Subscription 
  private alive = true;
  private destroy$: Subject<void> = new Subject<void>();
  error = "";
  success = "";

  pageSizeChanged: number = 9;
  pageNoChanged: number = 1;
  searchText: string = '';


  //Listing Models
  books: any[] = [];
  homeBooks: any[] = [];
  featuredBooks: any[] = [];

  pinnedBlog: any ;

  banners: any[] = [];
  haveBanners: boolean = false;

  blogs: any[] = [];
  haveBlogs: boolean = false;

  haveRecommendedBooks: boolean = false;
  recommendedBooksPagination: any[] = [];

  //Send a book
  bookInfoForm: FormGroup;
  submitted = false;

  categoriesDDL: MiscellaneousDDL[]

  //File Upload
  pdfSize: string = "";
  coverPage: string;
  coverPageOrignalFileName: string;
  bookUrl: string;
  bookOrignalFileName: string;
  fileReceiverResult: FileReceiverResult[]

  constructor(private _homeService: HomeData,
    private _commonService: CommonService,
    private _bookService: BookData,
    private _categoryService: CategoryData,
    private _miscellaneousService: MiscellaneousData,
    private formBuilder: FormBuilder,
    private _fileService: FileData,
    private _fileHelper: FileHelper,
    private swiperService: SwiperService) {

  }
  ngOnInit(): void {
    this.createFormGroup();
    this.loadCategories();
    var request = new BaseRequestModel()
    request.pageSize = 6;
    this.loadHomeData(request);
    this.loadRecommendedBooksTbl(new BaseRequestModel(1, 9));
  }
  get f() { return this.bookInfoForm.controls; }
  loadHomeData(request: BaseRequestModel) {
    this._homeService.get(request)
      .pipe(takeWhile(() => this.alive))
      .subscribe((response) => {
        if (response.success) {
          console.log(response?.data);
          this.homeBooks = response?.data?.books
          this.banners = response?.data?.banners
          this.blogs = response?.data?.blogs;
          if (this.homeBooks != null && this.homeBooks?.length > 0) {
            this.homeBooks.map(s => {
              s.coverPage = this._commonService.getCompletePath(s.coverPage);
              if (s.isPinned) {
                this.featuredBooks.push(s)
              }
              return s;
            });
          }
          if (this.banners != null && this.banners?.length > 0) {
            this.banners.map(s => {
              s.displayBGImage = this._commonService.getCompletePath(s.displayBGImage);
              return s;
            });
            this.haveBanners = true;
          } else {
            this.haveBanners = false;
          }
          if (this.blogs != null && this.blogs?.length > 0) {
            this.blogs.map(s => {
              s.coverPage = this._commonService.getCompletePath(s.coverPage);
              s.avatar = this._commonService.getCompletePath(s.avatar);
              if (s.isPinned) {
                this.pinnedBlog = s;
              }
              return s;
            });
            if (this._commonService.isNullOrEmpty(this.pinnedBlog)) {
              this.pinnedBlog = this.blogs[0];
            }
            this.haveBlogs = true;
          } else {
            this.haveBlogs = false;
          }

          console.log(this.blogs);
        }
      })
  }
  loadRecommendedBooksTbl(request: BaseRequestModel) {
    this._bookService.get(request)
      .pipe(takeWhile(() => this.alive))
      .subscribe((response) => {
        if (response.success) {
          this.books = response.data?.items;
          this.recommendedBooksPagination = response.data;
          if (this.books.length > 0) {
            this.books.map(s => {
              s.displayCoverPage = this._commonService.getCompletePath(s.displayCoverPage);
              s.discount = 0;
              return s;
            });
            this.haveRecommendedBooks = true;
          }
          else {
            this.haveRecommendedBooks = false;
          }
        } else {
          //this._messageService.Message(response.responseMessage, MessageType.error);
        }

      })

  }

  reloadRecommendedBooksTbl(callFrom: string, event: any) {
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
    this.loadRecommendedBooksTbl(obj)
  }

  downloadFile(book: any) {
    this._fileService.downloadFile(book.url, book.id, book.originalBookName).
      subscribe(response => {
        if (response?.state == "DONE") {
          console.log("File downloaded");
        }
      });
  }
  loadCategories() {
    this.categoriesDDL = []
    this._categoryService.getCategoryDDL(CategoryType.Book)
      .pipe(takeWhile(() => this.alive))
      .subscribe(response => {
        if (response.data != null)
          this.categoriesDDL = response.data;
      })

  }
  createFormGroup() {
    this.bookInfoForm = this.formBuilder.group({
      id: [''],
      categoryId: ["", Validators.required],
      description: ['Update this description', Validators.required],
      title: ['', Validators.required],
      author: ['', Validators.required],
      url: ['', Validators.required],
      coverPage: ['', Validators.required],
      language: ['', Validators.required],
      isPinned: [false],
      isReviewed: [false],
      isRecommended: [false],
      originalCoverPageName: [false],
      originalBookName: [false],
      pdfSize: [''],
    });
  }

  onfileUpload(event: any, fileType: string) {
    if (event != undefined && event != null) {
      this.fileReceiverResult = [];
      if (fileType == FileType.image) {
        if (!this._fileHelper.isValidFile(event, FileType.image)) {
          //this._messageService.Message("Invalid file selected", MessageType.error);
          return;
        }
        if (!this._fileHelper.isValidSize(event, FileType.image, SizeUnit.KB)) {
         // this._messageService.Message("File size is greater then " + Size.image + "KB.", MessageType.error);
          return;
        }
      } else if (fileType == FileType.pdf) {
        if (!this._fileHelper.isValidFile(event, FileType.pdf)) {
          //this._messageService.Message("Invalid file selected", MessageType.error);
          return;
        }
      }

      this._fileService.uploadFile(event)
        .pipe(takeUntil(this.destroy$))
        .subscribe(response => {
          if (response?.state == "DONE" && !this._commonService.isNullOrEmpty(response?.content)) {
            this.fileReceiverResult.push(response.content[0]);
            if (fileType == FileType.image) {
              this.coverPage = this.fileReceiverResult[0].filePath;
              this.coverPageOrignalFileName = this.fileReceiverResult[0].originalFileName
              this.f.coverPage.patchValue(this.coverPage);
              this.f.originalCoverPageName.patchValue(this.coverPageOrignalFileName);
            } else if (fileType == FileType.pdf) {
              this.bookUrl = this.fileReceiverResult[0].filePath;
              this.bookOrignalFileName = this.fileReceiverResult[0].originalFileName
              this.f.url.patchValue(this.bookUrl);
              var fileSize = this._fileHelper.getSize(event, "MB");
              this.pdfSize = fileSize + " " + "MB";
              this.f.pdfSize.patchValue(fileSize);
              this.f.originalBookName.patchValue(this.bookOrignalFileName);
            }
          }
        })
    }
  }
  action(item: any, actionType: string) {
    if (actionType == 'download') {
      this.downloadFile(item)
    }
  }
  onSubmit() {
    this.submitted = true;
    // stop h.ere if form is invalid
    if (this.bookInfoForm.invalid) {
      return;
    }
    // display form values on success
    this._bookService.sendBook(this.bookInfoForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: BaseResponseModel) => {
        if (response.success) {
          this.success = "Book successfully send.";
          //this._messageService.Message(response.responseMessage, MessageType.success);
          this.onReset();
        } else {
          this.error = response.responseMessage;
          //this._messageService.Message(response.responseMessage, MessageType.error);
        }
      });
  }

  onReset() {
    this.submitted = false;
    this.bookInfoForm.reset();
    this.bookOrignalFileName = "";
    this.coverPageOrignalFileName = "";
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

  ngAfterViewInit() {
    this.swiperService.initSwiper('.mySwiper', 1, 0, 3000, 1, 1, 1);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.alive = false;
  }
}

