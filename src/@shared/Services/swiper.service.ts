import { Injectable } from '@angular/core';
import Swiper from 'swiper';
import { register } from 'swiper/element/bundle';

@Injectable({
  providedIn: 'root'
})
export class SwiperService {
  constructor() {
    register();
  }

  initSwiper(container: string, slidesPerView: number, spaceBetween: number, autoplayDelay: number, small: number, medium: number, large: number) {
    return new Swiper(container, {
      slidesPerView,
      spaceBetween,
      loop: true,
      autoplay: {
        delay: autoplayDelay,
        disableOnInteraction: false
      },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
      pagination: { el: '.swiper-pagination', clickable: true },
      breakpoints: {
        576: { slidesPerView: small },
        768: { slidesPerView: medium },
        1024: { slidesPerView: large }
      }
    });
  }

  initVerticalSwiper(container: string, slidesPerView: number) {
    return new Swiper(container, {
      spaceBetween: 10,
      slidesPerView,
      direction: 'vertical',
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        100: {
          direction: 'horizontal',
          slidesPerView: 4,
        },
        1200: {
          direction: 'vertical',
        }
      }
    });
  }

  initThumbsSwiper(mainContainer: string, thumbsContainer: string) {
    const thumbsSwiper = new Swiper(thumbsContainer, {
      spaceBetween: 10,
      slidesPerView: 6,
      direction: 'vertical',
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }
    });

    return new Swiper(mainContainer, {
      slidesPerView: 1,
      spaceBetween: 10,
      direction: 'horizontal',
      autoHeight: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      thumbs: { swiper: thumbsSwiper }
    });
  }
  initThumbSwiper(container: string): Swiper {
    return new Swiper(container, {
      loop: true,
      spaceBetween: 10,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true, // Enables thumbs functionality
    });
  }

  // Initialize Main Swiper with Thumbnails
  initMainSwiper(container: string, thumbSwiper: Swiper): Swiper {
    return new Swiper(container, {
      loop: true,
      spaceBetween: 10,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      thumbs: {
        swiper: thumbSwiper, // Assign the thumbnail Swiper instance
      },
    });
  }
}
