import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page404',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './page404.component.html',
  styleUrls: ['./page404.component.scss']
})

/**
 * PAges-404 component
 */
export class Page404Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
