import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil, takeWhile } from 'rxjs';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AccountData } from '../../../../@core/data';
import { MFA } from '../../../../@core/models';
import { NgOtpInputModule } from 'ng-otp-input';
import { QrCodeModule } from 'ng-qrcode';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-two-step-verfication',
  standalone: true,
  imports: [CommonModule, NgOtpInputModule, QrCodeModule, ReactiveFormsModule, FormsModule, RouterLink, NgbAlert],
  templateUrl: './two-step-verfication.component.html',
  styleUrl: './two-step-verfication.component.scss'
})
export class TwoStepVerficationComponent implements OnInit {
  error = '';
  showRecoveryCodes: boolean = false;
  recoveryCodes: [];
  mfaModel: MFA = new MFA();
  mfaForm: FormGroup;
  submitted = false;
  otp: string;
  showOtpComponent = true;
  // Private
  private _unsubscribeAll: Subject<any> = new Subject();

  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;
  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '50px',
      'height': '50px',
      'display': 'flex'
    },
    containerStyles: {
      'display': 'flex'
    },
    inputClass: "is-invalid",
    containerClass: 'all_inputs'
  };
  private alive = true;
  returnUrl: string
  constructor(private _accountService: AccountData, private formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router) {
    // get return url from route parameters or default to '/'
    // tslint:disable-next-line: no-string-literal
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }
  ngOnInit(): void {
    this.mfaForm = this.formBuilder.group({
      authenticatorUri: [''],
      sharedKey: [''],
      code: ['', [Validators.required]],
    });
    this._accountService.getMFA()
      .pipe(takeWhile(() => this.alive))
      .subscribe(response => {
        if (response.success) {
          this.mfaModel = response.data;
          this.f.authenticatorUri.patchValue(this.mfaModel.authenticatorUri);
          this.f.sharedKey.patchValue(this.mfaModel.sharedKey);
        }
      })
  }
  onOtpChange(otp) {
    this.otp = otp;

  }
  // convenience getter for easy access to form fields
  get f() { return this.mfaForm.controls; }
  onSubmit() {
    this.submitted = true;
    this.f.code.patchValue(this.otp);
    // stop here if form is invalid
    if (this.mfaForm.invalid) {
      return;
    }
    this._accountService.enableMFA(this.mfaForm.value)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(result => {
        if (result.success) {
          localStorage.setItem("auth", result.data);
          this._router.navigate([this.returnUrl]);
          //this.showRecoveryCodes = true;
          //this.recoveryCodes = result.data;
          //localStorage.setItem("auth", result.data?.token)
          //if (result.data?.requiresTwoFactor == false) {
          //  this._router.navigate(['/account/enable-mfa'])
          //}
          //this._router.navigate(['/dashboard'])
        } else {
          this.error = result.responseMessage ? result.responseMessage : '';
        }
      });
  }
  copyToClipboard() {
    const textToCopy = this.recoveryCodes.join('\n'); // Join codes with newlines
    navigator.clipboard.writeText(textToCopy).then(() => {
      window.alert('Recovery codes copied to clipboard.');
    }).catch(error => {
      console.error('Failed to copy recovery codes: ', error);
    });
  }

  downloadCodes() {
    const blob = new Blob([this.recoveryCodes.join('\n')], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recovery_codes.txt';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
  ngOnDestory() {
    this.alive = false;
    this._unsubscribeAll.complete();
    this._unsubscribeAll.unsubscribe();
  }
}
