import { ApplicationConfig, ErrorHandler, provideZoneChangeDetection } from '@angular/core';
import { TitleStrategy, provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
//data
import {
  AccountData,
  BookData,
  CategoryData,
  FileData,
  HomeData,
  MiscellaneousData,
  StaticPagesData,
} from '../@core/data';

//Services
import {
  AccountService,
  BookService,
  CategoryService,
  FileService,
  HomeService,
  MiscellaneousService,
  StaticPagesService,
} from '../@core/services';
import { GlobalErrorHandler, HttpHandlerInterceptor, UtilsService } from '../@core/utils';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { SAVER, getSaver } from '../@core/saver.provider';
import { TemplatePageTitleStrategy } from '../@shared/TemplatePageTitleStrategy ';
import { provideQuillConfig } from 'ngx-quill';

const DATA_SERVICES = [
  { provide: HomeData, useClass: HomeService },
  { provide: FileData, useClass: FileService },
  { provide: BookData, useClass: BookService },
  { provide: StaticPagesData, useClass: StaticPagesService },
  { provide: MiscellaneousData, useClass: MiscellaneousService },
  { provide: AccountData, useClass: AccountService },
  { provide: CategoryData, useClass: CategoryService },
]

const ROOT_PROVIDERS = [
 DatePipe, UtilsService
]

export const CORE_PROVIDERS = [
  ...DATA_SERVICES,
  ...ROOT_PROVIDERS,
  { provide: SAVER, useFactory: getSaver },
  { provide: ErrorHandler, useClass: GlobalErrorHandler },
  { provide: HTTP_INTERCEPTORS, useClass: HttpHandlerInterceptor, multi: true },
  { provide: TitleStrategy, useClass: TemplatePageTitleStrategy },
]




export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    provideRouter(routes, withComponentInputBinding()),
    provideQuillConfig({
      theme: 'snow',
      placeholder: 'Enter text here...',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
          ['blockquote', 'code-block'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
          [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
            [{ direction: 'ltr' }, { direction: 'rtl' }],
           [{ 'language': ['en', 'ur'] }], // Custom, we'll wire this up manually                       // text direction

          [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

          [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
          [{ 'font': [] }],
          [{ 'align': [] }],

          ['clean'],                                         // remove formatting button
          ['link', 'image', 'video'],              // link and image, video

        ]
      }
    }),
    provideClientHydration(),
    ...CORE_PROVIDERS
  ]
};
