import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormControlName,
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import { TranslateService } from 'src/app/shared/services/translate.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { AngularFirestoreDbService } from 'src/app/shared/services/angular-firestore-db.service';
import { SharedData } from 'src/app/shared/data/shared-data';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss']
})
export class AuthFormComponent implements OnInit {
  private passwordMinLength = 6;
  authForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(this.passwordMinLength)
    ]),
    name: new FormControl(null)
  });
  get email() {
    return this.authForm.get('email');
  }
  get password() {
    return this.authForm.get('password');
  }
  get name() {
    return this.authForm.get('name');
  }
  hideInpuyIcon = true;

  authLogin = true;

  translate: {
    invalid: {
      password: string;
      email: string;
      name: string;
    };
    required: {
      password: string;
      email: string;
    };
  };

  showText: {
    title: string;
    subtitle: string;
    subtitleButton: string;
    submitButton: string;
  };

  uniqueNames: string[] = [];

  constructor(
    private auth: AngularFireAuth,
    private dbService: AngularFirestoreDbService,
    private snackBar: MatSnackBar,
    private router: Router,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.initTranslate();
    this.authChange(false);
    this.dbService.getUniqueNames().subscribe(val => {
      console.log(val);
      this.uniqueNames = val;
    });
  }

  onSubmit() {
    this.authLogin ? this.login() : this.signUp();
  }

  login() {
    this.auth.auth
      .signInWithEmailAndPassword(this.email.value, this.password.value)
      .then(result => {
        this.dbService.userName.subscribe(name => {
          this.snackBar.open(
            this.translateService.translate('HELLO', { name: name }),
            '',
            SharedData.snackBarDuration1
          );
          this.router.navigate(['main']);
        });
      })
      .catch(err => {
        console.log(err);

        this.snackBar.open(err.message, '', SharedData.snackBarDuration3);
      });
  }

  signUp() {
    this.auth.auth
      .createUserWithEmailAndPassword(this.email.value, this.password.value)
      .then(() => {
        const _that = this;
        this.auth.user.subscribe(function(user) {
          _that.dbService.createUserCollection(user, _that.name.value);
          _that.snackBar.open(
            _that.translateService.translate('AUTH.SUCCESS_SIGN_UP'),
            '',
            SharedData.snackBarDuration1
          );
          _that.router.navigate(['main']);
          this.complete();
        });
      })
      .catch(err => {
        this.snackBar.open(err.message, '', SharedData.snackBarDuration3);
      });
  }

  isInvalid(controlName: FormControlName) {
    if (controlName.invalid && (controlName.dirty || controlName.touched)) {
      return true;
    }
    return false;
  }

  errorMessage(controlName: AbstractControl) {
    if (controlName.hasError('required') && controlName === this.email) {
      return this.translate.required.email;
    } else if (controlName.hasError('email') && controlName === this.email) {
      return this.translate.invalid.email;
    } else if (
      controlName.hasError('required') &&
      controlName === this.password
    ) {
      return this.translate.required.password;
    } else if (
      !controlName.hasError('minLength') &&
      controlName === this.password
    ) {
      return this.translate.invalid.password;
    } else if (controlName.hasError('validName') && controlName === this.name) {
      return this.translate.invalid.name;
    }
  }

  authChange(isChange = true) {
    this.authLogin = isChange ? !this.authLogin : true;
    if (this.authLogin) {
      this.manageNameControl(false);
      this.showText = {
        title: this.translateService.translate('AUTH.LOGIN_TITLE'),
        subtitle: this.translateService.translate('AUTH.DONTACCOUNT_TITLE'),
        subtitleButton: this.translateService.translate('AUTH.SIGNUP'),
        submitButton: this.translateService.translate('AUTH.LOGIN')
      };
    } else {
      this.manageNameControl(true);
      this.showText = {
        title: this.translateService.translate('AUTH.SIGNUP_TITLE'),
        subtitle: this.translateService.translate('AUTH.HAVEACCOUNT_TITLE'),
        subtitleButton: this.translateService.translate('AUTH.LOGIN'),
        submitButton: this.translateService.translate('AUTH.SIGNUP')
      };
    }
  }

  private manageNameControl(setName: boolean) {
    if (setName) {
      this.name.setValidators([
        Validators.required,
        uniqueNameValidator(this.uniqueNames)
      ]);
    } else {
      this.name.clearValidators();
    }
    this.name.updateValueAndValidity();
  }

  private initTranslate() {
    this.translate = {
      invalid: {
        password: this.translateService.translate(
          'ERROR_MESSAGE.INVALID.PASSWORD',
          { value: this.passwordMinLength + '' }
        ),
        email: this.translateService.translate('ERROR_MESSAGE.INVALID.EMAIL'),
        name: this.translateService.translate('ERROR_MESSAGE.INVALID.NAME')
      },
      required: {
        password: this.translateService.translate(
          'ERROR_MESSAGE.REQUIRED.PASSWORD'
        ),
        email: this.translateService.translate('ERROR_MESSAGE.REQUIRED.EMAIL')
      }
    };
  }
}

function uniqueNameValidator(uniqueNames: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    console.log('uniqueNameAsyncValidator', control.value);
    if (uniqueNames.find(val => val === control.value)) {
      const error = { validName: 'validName' };
      control.setErrors(error);
      return error;
    }
    return null;
  };
}
