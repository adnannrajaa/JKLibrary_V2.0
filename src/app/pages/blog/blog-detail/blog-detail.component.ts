import { Component, OnDestroy, OnInit } from '@angular/core';
import { FooterComponent, TopbarComponent } from '../../../layouts';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BlogData, BookData, FileData } from '../../../../@core/data';
import { CommonService } from '../../../../@shared/common-service.service';
import { takeWhile } from 'rxjs';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, TopbarComponent, FooterComponent, RouterModule],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.scss'
})
export class BlogDetailComponent implements OnInit, OnDestroy {
  blogId: string;
  blogDetail: any;
  private alive = true;
  constructor(private route: ActivatedRoute,
    private _blogService: BlogData,
    private _commonService: CommonService) {

  }
  ngOnInit() {
    this.blogId = this.route.snapshot.paramMap.get('id');
    this._commonService.isNullOrEmpty(this.blogId) ? "" : this.getBlogDetail(this.blogId)
  }
  getCompletePath(imageurl) {
    return this._commonService.getCompletePath(imageurl);
  }

  getBlogDetail(id: string) {
    this._blogService.getBlogDetail(id)
      .pipe(takeWhile(() => this.alive))
      .subscribe((response) => {
        if (response.success) {
          this.blogDetail = response.data;
          this.blogDetail.coverPage = this.getCompletePath(this.blogDetail.coverPage);
          this.blogDetail.avatar = this.getCompletePath(this.blogDetail.avatar);
        } else {
          console.log(response.errors)
        }
      })
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}
