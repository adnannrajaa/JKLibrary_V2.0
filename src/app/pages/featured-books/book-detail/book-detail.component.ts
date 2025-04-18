import { Component } from '@angular/core';
import { FooterComponent, TopbarComponent } from '../../../layouts';


@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [TopbarComponent, FooterComponent],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.scss'
})
export class BookDetailComponent {

}
