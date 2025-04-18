import { Component } from '@angular/core';
import { FooterComponent, TopbarComponent } from '../../layouts';

@Component({
  selector: 'app-interview',
  standalone: true,
  imports: [TopbarComponent, FooterComponent],
  templateUrl: './interview.component.html',
  styleUrl: './interview.component.scss'
})
export class InterviewComponent {

}
