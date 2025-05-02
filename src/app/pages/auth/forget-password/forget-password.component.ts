import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { AccountData } from '../../../../@core/data';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink, NgbAlert],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent implements OnInit, AfterViewInit {

  resetForm: FormGroup;
  submitted = false;
  error = '';
  success = '';
  loading = false;
  // Private
  private _unsubscribeAll: Subject<any> = new Subject();
  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private _accountService: AccountData,
    private router: Router) { }

  ngOnInit() {

    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngAfterViewInit() {
  }

  // convenience getter for easy access to form fields
  get f() { return this.resetForm.controls; }

  /**
   * On submit form
   */
  onSubmit() {
    this.success = '';
    this.submitted = true;

    // stop here if form is invalid
    if (this.resetForm.invalid) {
      return;
    }
    this._accountService.forgotPassword(this.resetForm.value)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(result => {
        if (result.success) {
          this.success = result.responseMessage ? result.responseMessage : '';
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
