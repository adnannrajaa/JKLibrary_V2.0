import { Component } from '@angular/core';
import { FooterComponent, TopbarComponent } from '../../layouts';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [ TopbarComponent, FooterComponent ],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent {

}
