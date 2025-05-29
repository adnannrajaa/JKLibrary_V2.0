import { Component, OnInit } from '@angular/core';
import { FooterComponent, TopbarComponent } from '../../layouts';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { BaseResponseModel } from '../../../@core/models';
import { StaticPagesData } from '../../../@core/data';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule, TopbarComponent, FooterComponent, FormsModule, ReactiveFormsModule, NgbAlert,],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  error = "";
  success = "";

  contactInfoForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder,
    private _staticService: StaticPagesData) {

  }

  ngOnInit(): void {
    this.createFormGroup();
  }

  get f() { return this.contactInfoForm.controls; }

  createFormGroup() {
    this.contactInfoForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.contactInfoForm.invalid) {
      return;
    }
    // display form values on success
    this._staticService.saveContactUs(this.contactInfoForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: BaseResponseModel) => {
        if (response.success) {
          this.success = "Thanks for reaching out! We’ll get back to you shortly.";
          //this._messageService.Message(response.responseMessage, MessageType.success);
          this.onReset();
        } else {
          this.error = response.responseMessage;
          //this._messageService.Message(response.responseMessage, MessageType.error);
        }
      });
  }

  onReset() {
    this.submitted = false;
    this.contactInfoForm.reset();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
