import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';
import { SignUpComponent } from './pages/auth/sign-up/sign-up.component';
import { TwoStepVerficationComponent } from './pages/auth/two-step-verfication/two-step-verfication.component';
import { MfaCodeComponent } from './pages/auth/mfa-code/mfa-code.component';
import { FeaturedBooksComponent } from './pages/featured-books/featured-books.component';
import { InterviewComponent } from './pages/interview/interview.component';
import { BlogComponent } from './pages/blog/blog.component';
import { BlogDetailComponent } from './pages/blog/blog-detail/blog-detail.component';
import { ArchivesComponent } from './pages/archives/archives.component';
import { LegalComponent } from './pages/legal/legal.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AboutComponent } from './pages/about/about.component';
import { BookDetailComponent } from './pages/featured-books/book-detail/book-detail.component';
import { ForgetPasswordComponent } from './pages/auth/forget-password/forget-password.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: '', component: AppComponent,
    children: [
      { path: 'login', title: 'Login', component: LoginComponent },
      { path: 'reset-password', title: 'Reset Password', component: ResetPasswordComponent },
      { path: 'register', title: 'Register', component: SignUpComponent },
      { path: 'two-step-verify', title: 'Two Step Authanticator', component: TwoStepVerficationComponent },
      { path: 'forget-password', title: 'Forget Password', component: ForgetPasswordComponent },
      { path: 'mfa-code', title: 'MFA', component: MfaCodeComponent },
      { path: 'home', title: 'Home', component: HomeComponent },
      { path: 'featured-book', title: 'Featured Book', component: FeaturedBooksComponent },
      { path: 'interview', title: 'Interview', component: InterviewComponent },
      { path: 'blog', title: 'Blog', component: BlogComponent },
      { path: 'blog-detail', title: 'Blog Detail', component: BlogDetailComponent },
      { path: 'archives', title: 'Archives', component: ArchivesComponent },
      { path: 'legal', title: 'Legal', component: LegalComponent },
      { path: 'contact-us', title: 'Contact Us', component: ContactUsComponent },
      { path: 'dashboard', title: 'Dashbaord', component: DashboardComponent },
      { path: 'about', title: 'About Us', component: AboutComponent },
      { path: 'book-detail', title: 'Book Detail', component: BookDetailComponent },
    ],
  },
];
