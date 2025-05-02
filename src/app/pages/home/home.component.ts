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
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TopbarComponent, FooterComponent, FormsModule, ReactiveFormsModule, NgbAlert],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})  
export class HomeComponent implements OnInit {
  // Subscription 
  private alive = true;
  private destroy$: Subject<void> = new Subject<void>();
  error = "";
  success = "";

  //Listing Models
  books: any[] = [];
  banners: any[] = [];

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
    private _fileHelper: FileHelper) {

  }
  ngOnInit(): void {
    this.createFormGroup();
    this.loadCategories();
    var request = new BaseRequestModel()
    request.pageSize = 4;
    this.loadHomeData(request);
  }
  get f() { return this.bookInfoForm.controls; }
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
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.alive = false;
  }
}

