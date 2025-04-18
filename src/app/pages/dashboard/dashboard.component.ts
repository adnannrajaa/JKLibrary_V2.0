import { Component } from '@angular/core';
import { FooterComponent, TopbarComponent } from '../../layouts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TopbarComponent, FooterComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
