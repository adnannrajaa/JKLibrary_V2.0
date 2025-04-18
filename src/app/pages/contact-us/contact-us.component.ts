import { Component } from '@angular/core';
import { FooterComponent, TopbarComponent } from '../../layouts';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [TopbarComponent, FooterComponent],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent {

}
