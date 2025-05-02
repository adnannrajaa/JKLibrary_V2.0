import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AccountData } from '../../../../@core/data';
import { MessageType, RegexpPattern } from '../../../../@shared/constants/constant';
import { CommonModule } from '@angular/common';
import { User } from '../../../../@core/models';
import { MessageService } from '../../../../@shared/message/message.service';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbAlert],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent implements OnInit {
  // Private
  private destroy$: Subject<void> = new Subject<void>();
  //Others
  userInfoForm: FormGroup;
  userInfo: User = new User();
  error: string = '';
  success: string = '';
  submitted = false;
  constructor(private formBuilder: FormBuilder,
    private _messageService: MessageService,
    private _accountService: AccountData) {
  }

  ngOnInit(): void {
    this.CreateFormGroup()
  }
  get f() { return this.userInfoForm.controls; }
  CreateFormGroup() {
    this.userInfoForm = this.formBuilder.group({
      id: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      isBlogger: [false],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', [Validators.required, Validators.pattern(RegexpPattern.phoneNumber)]],
    });
  }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.userInfoForm.invalid) {
      return;
    }
    this._accountService.saveUser(this.userInfoForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        if (response.success) {
          this.success = "You account has been created. Please check your email to set password."
        } else {
          this.error = response.responseMessage
        }
        this.resetModel();
      });
  }
  
  resetModel() {
    this.submitted = false;
  }
  ngOnDestory() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
