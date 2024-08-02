import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: '', component: AppComponent,
    children: [
      { path: 'home', title: 'Home', component: HomeComponent },
    ],
  },
];
