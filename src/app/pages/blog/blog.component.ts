import { Component, OnDestroy, OnInit } from '@angular/core';
import { FooterComponent, TopbarComponent } from '../../layouts';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { BlogData, BookData, FileData } from '../../../@core/data';
import { CommonService } from '../../../@shared/common-service.service';
import { BaseRequestModel } from '../../../@core/models';
import { takeWhile } from 'rxjs';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, TopbarComponent, FooterComponent, RouterModule, NgbPagination],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent implements OnInit, OnDestroy {
  //pagination variables 
  pageSizeChanged: number = 9;
  pageNoChanged: number = 1;
  searchText: string = '';
  showPagination: boolean = false;

  blogs: any[] = [];
  blogsPagination: any[] = [];
  haveBlogs: boolean = false;
  pinnedBlog: any;

  private alive = true;
  constructor(private route: ActivatedRoute,
    private _blogService: BlogData,
    private _commonService: CommonService) {

  }
  ngOnInit(): void {
    this.loadBlogsTbl(new BaseRequestModel(1, 9));
  }
  getCompletePath(imageurl) {
    return this._commonService.getCompletePath(imageurl);
  }
  loadBlogsTbl(request: BaseRequestModel) {
    this._blogService.getBlogs(request)
      .pipe(takeWhile(() => this.alive))
      .subscribe((response) => {
        if (response.success) {
          this.blogs = response.data?.items;
          this.blogsPagination = response.data;
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
        } else {
          //this._messageService.Message(response.responseMessage, MessageType.error);
        }

      })
  }
  reloadBlogsTbl(callFrom: string, event: any) {
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
    this.loadBlogsTbl(obj)
  }
  ngOnDestroy(): void {
    this.alive = false;
  }
}
