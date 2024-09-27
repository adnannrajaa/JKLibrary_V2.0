import { Component } from '@angular/core';
import { SlickCarouselModule } from 'ngx-slick-carousel';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [SlickCarouselModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  title = 'ng-carousel-demo';
  slideConfig = {
    slidesToShow: 3,
    slidesToScroll: 1,
    centerPadding: '40px',
    centerMode: true,
    adaptiveHeight: true,
    dots: true,
    variableWidth: true,

    responsive: [
      {
        breakpoint: 1200,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '40px',
          slidesToShow: 2
        }
      },
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '40px',
          slidesToShow: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '40px',
          slidesToShow: 1
        }
      }
    ]
  };
  
  slides = [
    {img: "https://dummyimage.com/350x150/423b42/fff"},
    {img: "https://dummyimage.com/350x150/2a2b7a/fff"},
    {img: "https://dummyimage.com/350x150/1a2b7a/fff"},
    {img: "https://dummyimage.com/350x150/7a2b7a/fff"},
    {img: "https://dummyimage.com/350x150/9a2b7a/fff"},
    {img: "https://dummyimage.com/350x150/5a2b7a/fff"},
    {img: "https://dummyimage.com/350x150/4a2b7a/fff"}
  ];
  
}
