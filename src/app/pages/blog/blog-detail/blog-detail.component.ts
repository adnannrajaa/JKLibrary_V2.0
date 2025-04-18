import { Component } from '@angular/core';
import { FooterComponent, TopbarComponent } from '../../../layouts';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [TopbarComponent, FooterComponent],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.scss'
})
export class BlogDetailComponent {

}
