import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AccountData } from '../../../../@core/data';
import { AuthScreen } from '../../../../@shared/constants/constant';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;
  error = '';
  passwordTextType: boolean;
  returnUrl: string
  currentScreen: string = AuthScreen.Login;

  // Private
  private _unsubscribeAll: Subject<any> = new Subject();
  // set the currenr year
  year: number = new Date().getFullYear();

  constructor(private formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _accountService: AccountData,
    private _router: Router) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      twoFactorCode: [''],
      recoveryCode: [''],
    });

    // reset login status
    localStorage.clear();
    // get return url from route parameters or default to '/'
    // tslint:disable-next-line: no-string-literal
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  /**
   * Toggle password
   */
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  showRecoveryCodeScreen() {
    this.currentScreen = AuthScreen.RecoveryCodes
    this.submitted = false;
    this.error = '';
    this.f.recoveryCode.setValidators([Validators.required])
    this.f.recoveryCode.updateValueAndValidity();

    this.f.twoFactorCode.removeValidators([Validators.required, Validators.minLength(6),
    Validators.maxLength(7)])
    this.f.twoFactorCode.updateValueAndValidity();
  }

  showMFAScreen() {
    this.submitted = false;
    this.error = '';
    this.currentScreen = AuthScreen.MFA
    this.f.twoFactorCode.setValidators([Validators.required, Validators.minLength(6),
    Validators.maxLength(7)])
    this.f.twoFactorCode.updateValueAndValidity();

    this.f.recoveryCode.removeValidators([Validators.required])
    this.f.recoveryCode.updateValueAndValidity();
  }
  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;
    this.error = '';
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this._accountService.login(this.loginForm.value, this.currentScreen)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(result => {
        if (result.success) {
          if (result.data?.requiresTwoFactor) {
            this.showMFAScreen();
          } else {
            localStorage.setItem("auth", result.data?.token);
            if (result.data?.twoFactorEnabled) {
              this._router.navigate([this.returnUrl]);
            } else {
              this._router.navigate(['/two-step-verify']);
            }
          }
        } else {
          this.error = result.responseMessage ? result.responseMessage : '';
        }
      });
  }
  ngOnDestory() {
    this._unsubscribeAll.complete();
    this._unsubscribeAll.unsubscribe();
  }
}

