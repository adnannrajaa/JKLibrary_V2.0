import { ApplicationConfig, ErrorHandler, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
//data
import {
  AccountData,
  BookData,
  FileData,
  HomeData,
  MiscellaneousData,
  StaticPagesData,
  UserData,
} from '../@core/data';

//Services
import {
  AccountService,
  BookService,
  FileService,
  HomeService,
  MiscellaneousService,
  StaticPagesService,
  UserService,
} from '../@core/services';
import { GlobalErrorHandler, HttpHandlerInterceptor, UtilsService } from '../@core/utils';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { SAVER, getSaver } from '../@core/saver.provider';

const DATA_SERVICES = [
  { provide: UserData, useClass: UserService },
  { provide: HomeData, useClass: HomeService },
  { provide: FileData, useClass: FileService },
  { provide: BookData, useClass: BookService },
  { provide: StaticPagesData, useClass: StaticPagesService },
  { provide: MiscellaneousData, useClass: MiscellaneousService },
  { provide: AccountData, useClass: AccountService },
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

]




export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(),
    ...CORE_PROVIDERS
  ]
};
