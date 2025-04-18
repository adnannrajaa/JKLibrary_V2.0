import { Component } from '@angular/core';
import { FooterComponent, TopbarComponent } from '../../layouts';

@Component({
  selector: 'app-legal',
  standalone: true,
  imports: [TopbarComponent, FooterComponent],
  templateUrl: './legal.component.html',
  styleUrl: './legal.component.scss'
})
export class LegalComponent {

}
