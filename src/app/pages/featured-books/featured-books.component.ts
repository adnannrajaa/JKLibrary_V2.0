import { Component } from '@angular/core';
import { TopbarComponent, FooterComponent } from '../../layouts';


@Component({
  selector: 'app-featured-books',
  standalone: true,
  imports: [TopbarComponent, FooterComponent],
  templateUrl: './featured-books.component.html',
  styleUrl: './featured-books.component.scss'
})
export class FeaturedBooksComponent {

}
