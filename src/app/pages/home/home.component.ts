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
import { TruncateHtmlPipe } from '../../../@shared/pipes';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TopbarComponent, FooterComponent, FormsModule, ReactiveFormsModule, NgbAlert, RouterModule, NgbPagination, TruncateHtmlPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})  
export class HomeComponent implements OnInit {
  // Subscription 
  private alive = true;
  private destroy$: Subject<void> = new Subject<void>();
  error = "";
  success = "";
  showAdvancedSearch = false;
  hasActiveFilters = false;
  activeFilters: string[] = [];

  pageSizeChanged: number = 9;
  pageNoChanged: number = 1;
  searchText: string = '';


  //Listing Models
  books: any[] = [];
  homeBooks: any[] = [];
  featuredBooks: any[] = [];

  pinnedBlog: any ;
  pinnedInterview: any ;
  pinnedNews: any ;

  banners: any[] = [];
  haveBanners: boolean = false;

  blogs: any[] = [];
  haveBlogs: boolean = false;


  interviews: any[] = [];
  haveInterview: boolean = false;

  news: any[] = [];
  haveNews: boolean = false;

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
          const data = response?.data;

          this.homeBooks = data?.books || [];
          this.banners = data?.banners || [];
          this.blogs = data?.blogs || [];
          this.interviews = data?.interviews || [];
          this.news = data?.news || [];

          this.handleBooks(this.homeBooks);
          this.handleBanners(this.banners);
          this.handleBlogs(this.blogs);
          this.handleInterviews(this.interviews);
          this.handleNews(this.news);
        }
      })
  }

  private handleBooks(books: any[]) {
    this.featuredBooks = books.map(book => {
      book.coverPage = this._commonService.getCompletePath(book.coverPage);
      return book;
    }).filter(book => book.isPinned);
  }

  private handleBanners(banners: any[]) {
    banners.forEach(banner => {
      banner.displayBGImage = this._commonService.getCompletePath(banner.displayBGImage);
    });
    this.haveBanners = banners.length > 0;
  }

  private handleBlogs(blogs: any[]) {
    if (blogs.length > 0) {
      blogs.forEach(blog => {
        blog.coverPage = this._commonService.getCompletePath(blog.coverPage);
        blog.avatar = this._commonService.getCompletePath(blog.avatar);
      });

      this.pinnedBlog = blogs.find(blog => blog.isPinned) || blogs[0];
      this.blogs = blogs.filter(blog => blog !== this.pinnedBlog); // Remove pinned blog from list
      this.haveBlogs = true;
    } else {
      this.pinnedBlog = null;
      this.blogs = [];
      this.haveBlogs = false;
    }
  }


  private handleInterviews(interviews: any[]) {
    if (interviews.length > 0) {
      this.pinnedInterview = interviews.find(i => i.isPinned) || interviews[0];
      this.interviews = interviews.filter(i => i !== this.pinnedInterview);
      this.haveInterview = true;
    } else {
      this.haveInterview = false;
    }
  }

  private handleNews(news: any[]) {
    if (news.length > 0) {
      news.forEach(n => {
        n.bgImage = this._commonService.getCompletePath(n.bgImage);
      });
      this.pinnedNews = news.find(n => n.isPinned) || news[0];
      this.haveNews = true;
    } else {
      this.haveNews = false;
    }
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
            console.log(this.books)
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
        console.log(this.categoriesDDL)
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
        if (!this._fileHelper.isValidSize(event, FileType.pdf,"MB")) {
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

  toggleAdvancedSearch() {
    this.showAdvancedSearch = !this.showAdvancedSearch;
  }
  
  resetFilters() {
    this.activeFilters = [];
    this.hasActiveFilters = false;
    // Reset your filter values here
    this.reloadRecommendedBooksTbl('search', '');
  }
  
  removeFilter(filter: string) {
    this.activeFilters = this.activeFilters.filter(f => f !== filter);
    this.hasActiveFilters = this.activeFilters.length > 0;
    // Update your search results based on remaining filters
  }
  
  filterByBadge(badge: string) {
    // Implement badge filtering logic
    this.activeFilters.push(badge);
    this.hasActiveFilters = true;
  }
  
  toggleFavorite(book: any) {
    book.isFavorite = !book.isFavorite;
    // Implement your favorite toggle logic
  }

  ngAfterViewInit() {
    this.swiperService.initSwiper('.mySwiper', 1, 0, 3000, 1, 1, 1);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.alive = false;
  }
}

