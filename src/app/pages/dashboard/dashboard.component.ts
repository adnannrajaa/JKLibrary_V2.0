import { Component, OnInit } from '@angular/core';
import { FooterComponent, TopbarComponent } from '../../layouts';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil, takeWhile } from 'rxjs';
import { AccountData, FileData } from '../../../@core/data';
import { FileReceiverResult } from '../../../@core/models';
import { CommonService } from '../../../@shared/common-service.service';
import { FileHelper } from '../../../@shared/file-helper-service.service';
import { MessageService } from '../../../@shared/message/message.service';
import { RegexpPattern, FileType, MessageType, SizeUnit, Size, StrongPasswordRegx } from '../../../@shared/constants/constant';
import { CustomValidators } from '../../../@shared/CustomValidators';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TopbarComponent, FooterComponent, CommonModule, RouterModule, ReactiveFormsModule, FormsModule, QuillModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  //Image Handling
  image: string = null;
  fileReceiverResult: FileReceiverResult[]

  //static prop
  email: string = null;

  //Subscription 
  private alive = true;
  private destroy$: Subject<void> = new Subject<void>();

  //Personal Info Form
  personalInfoForm: FormGroup;
  personalInfoSubmitted: boolean = false

  //Change Password Form
  changePasswordForm: FormGroup;
  changePasswordSubmitted: boolean = false

  public passwordTextTypeOld = false;
  public passwordTextTypeNew = false;
  public passwordTextTypeRetype = false;

  //Address Form
  addressForm: FormGroup;
  addressSubmitted: boolean = false
  content: string = '';
  isUrdu: boolean = true;
  placeholderText: string = 'Enter text here...';

  editorModules = {
    theme: 'snow',
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        [{ direction: 'rtl' }],
       
        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],

        ['clean'],                                         // remove formatting button
      ],
    }
  };
  constructor(private _accountData: AccountData,
    private _fileHelper: FileHelper,
    private _fileService: FileData,
    private _commonService: CommonService,
    private _messageService: MessageService) {
  }
  ngOnInit(): void {
    // content header
    this.createForms();
    this.loadCurrentUser()
  }
  createForms() {
    // Personal Info Form Creation 
    this.personalInfoForm = new FormGroup(
      {
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        gender: new FormControl('', [Validators.required]),
        phoneNumber: new FormControl('', [Validators.required, Validators.pattern(RegexpPattern.phoneNumber)]),
        image: new FormControl(''),
        avatar: new FormControl(''),
        birthDate: new FormControl(''),

      },
    );

    // Change Password Form Creation
    this.changePasswordForm = new FormGroup(
      {
        oldPassword: new FormControl('', [Validators.required]),
        newPassword: new FormControl('', [Validators.required, Validators.pattern(StrongPasswordRegx)]),
        confirmPassword: new FormControl('', [Validators.required])
      },
      CustomValidators.mustMatch('newPassword', 'confirmPassword')
    );

    // Address Form Creation
    this.addressForm = new FormGroup(
      {
        country: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        postcode: new FormControl('', [Validators.required]),
        address1: new FormControl('', [Validators.required]),
        address2: new FormControl(''),
      },
    );
  }
  get passwordFormField() {
    return this.changePasswordForm.get('newPassword');
  }
  isPasswordStrong(): boolean {
    const password = this.passwordFormField?.value;
    if (!password) {
      return false;
    }

    const hasUppercase = password.match('^(?=.*[A-Z])');
    const hasLowercase = password.match('(?=.*[a-z])');
    const hasNumber = password.match('(.*[0-9].*)');
    const hasSpecialChar = password.match('(?=.*[!@#$%^&*])');
    const isLongEnough = password.match('.{8,}');

    return hasUppercase && hasLowercase && hasNumber && hasSpecialChar && isLongEnough;
  }
  get changePassword() { return this.changePasswordForm.controls; }
  get personalInfo() { return this.personalInfoForm.controls; }
  get addressInfo() { return this.addressForm.controls; }

  /**
 * Toggle Password Text Type Old
 */
  togglePasswordTextTypeOld() {
    this.passwordTextTypeOld = !this.passwordTextTypeOld;
  }

  /**
   * Toggle Password Text Type New
   */
  togglePasswordTextTypeNew() {
    this.passwordTextTypeNew = !this.passwordTextTypeNew;
  }

  /**
   * Toggle Password Text Type Retype
   */
  togglePasswordTextTypeRetype() {
    this.passwordTextTypeRetype = !this.passwordTextTypeRetype;
  }



  loadCurrentUser() {
    this._accountData.getActiveUserInfo()
      .pipe(takeWhile(() => this.alive))
      .subscribe(response => {
        if (response.success) {
          this.email = response.data?.email;
          this.image = this._commonService.getCompletePath(response.data?.avatar)

          this.personalInfoForm.patchValue(response.data);
          this.addressForm.patchValue(response.data);
        }
      })
  }




  onfileUpload(event: any) {
    if (event != undefined && event != null) {
      this.fileReceiverResult = [];
      if (!this._fileHelper.isValidFile(event, FileType.image)) {
        this._messageService.Message("Invalid file selected", MessageType.error);
        return;
      }
      if (!this._fileHelper.isValidSize(event, FileType.image, SizeUnit.KB)) {
        this._messageService.Message("File size is greater then " + Size.image + "KB.", MessageType.error);
        return;
      }
      this._fileService.uploadFile(event)
        .pipe(takeUntil(this.destroy$))
        .subscribe(response => {
          if (response?.state == "DONE" && !this._commonService.isNullOrEmpty(response?.content)) {
            this.fileReceiverResult.push(response.content[0]);
            this.image = this._commonService.getCompletePath(this.fileReceiverResult[0].filePath);
            this.personalInfo.avatar.patchValue(this.fileReceiverResult[0].filePath);
          }


        })
    }
  }
  onChangePasswordSubmit() {
    this.changePasswordSubmitted = true;
    if (this.changePasswordForm.invalid) {
      return;
    }
    this._accountData.changePassword(this.changePasswordForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        if (response.success) {
          this._messageService.Message(response.responseMessage, MessageType.success);
        } else {
          this._messageService.Message(response.responseMessage, MessageType.error);
        }
      });
  }
  onTabClick() {
    this.changePasswordSubmitted = false;
    this.addressSubmitted = false;
    this.personalInfoSubmitted = false;
  }
  onPrsonalInfoSubmit() {
    this.personalInfoSubmitted = true;
    // stop here if form is invalid
    if (this.personalInfoForm.invalid) {
      return;
    }
    //var mySqlDate = this._commonService.sqlDateFormat(this.personalInfo.birthDate.value)
    //this.personalInfo.birthDate.patchValue(mySqlDate);

    this._accountData.updatePersonalInfo(this.personalInfoForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        if (response.success) {
          this._messageService.Message(response.responseMessage, MessageType.success);
        } else {
          this._messageService.Message(response.responseMessage, MessageType.error);
        }
      });
  }
  onAddressSubmit() {
    this.addressSubmitted = true;
    // stop here if form is invalid
    if (this.addressForm.invalid) {
      return;
    }
    this._accountData.updateAddress(this.addressForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        if (response.success) {
          this._messageService.Message(response.responseMessage, MessageType.success);
        } else {
          this._messageService.Message(response.responseMessage, MessageType.error);
        }
      });
  }
  setLanguage(lang: string) {
    this.isUrdu = (lang === 'ur');
    this.placeholderText = this.isUrdu ? 'یہاں متن درج کریں...' : 'Enter text here...';
  }
  ngOnDestory() {
    this.alive = false;
    this.destroy$.next();
    this.destroy$.complete();
  }
}

