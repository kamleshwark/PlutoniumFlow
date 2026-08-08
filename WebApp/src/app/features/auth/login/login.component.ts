import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MsalModule } from '@azure/msal-angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMicrosoft } from '@fortawesome/free-brands-svg-icons';
import { forkJoin, retry, tap } from 'rxjs';
import { AzureAuthService } from 'src/app/auth/azure-auth.service';
import { AlertService } from 'src/app/services/Alert.service';
import { EncryptionService } from 'src/app/services/Encryption.service';
import { HttpService } from 'src/app/services/http.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { UserService } from 'src/app/services/user.service';
import { Spinkit } from 'src/app/theme/shared/components/spinner/spinkits';
import { AlertSeverity } from 'src/app/utilities/Alert';
import { CommonFunctions } from 'src/app/utilities/CommonFunctions';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FontAwesomeModule, MsalModule, FontAwesomeModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export default class LoginComponent implements OnInit {

  private encryptionService = inject(EncryptionService);
  private alertService = inject(AlertService);
  private httpService = inject(HttpService);
  private router = inject(Router);
  private userService = inject(UserService);
  private spinnerService = inject(SpinnerService);
  private azureAuthService = inject(AzureAuthService);

  loginForm!: FormGroup;
  loginFailedError = signal(LoginError.eNone);
  loginFailureErrorMsg = '';
  loginDetailsLocalStorageName = 'loginDetails';
  rememberMeLocalStorageName = 'rememberMe';
  encryptionKeyStorageName = 'encryptionKey';

  msIcon = faMicrosoft;
  azureAuthActive = false;
  
  constructor() { 

    try {
      effect(() => {
        this.loginForm.get('username')?.updateValueAndValidity();
        this.loginForm.get('password')?.updateValueAndValidity();        
      });
    } catch (ex) {
      console.log('Error in login component constructor', ex);
      
    }
  }

  async ngOnInit() {
    try {
      this.userService.logout();
      this.initializeForm();
      await this.autofillUserDetails();
      this.FetchPreLoginData();
      
    } catch (ex) {
      console.log('Error in Login Component initialization', ex);

    }
  }

  initializeForm() {

    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, this.usernameValidator(), this.lockoutValidator()]),
      password: new FormControl('', [Validators.required, this.passwordValidator()]),
      rememberMe: new FormControl(false, [])
    });
  }

  usernameValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      let validator: any;
      if (LoginError.eInvalidUsername == this.loginFailedError()) {
        validator = {invalidUsername: true};
      }
      return validator;
    }
  }

  passwordValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      let validator: any;
      if (LoginError.eInvalidPassword == this.loginFailedError()) {
        validator = {invalidPassword: true};
      }
      return validator;
    }
  }

  lockoutValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      let validator: any;
      if (LoginError.eUserLockedout == this.loginFailedError()) {
        validator = {userLockedout: true};
      }
      return validator;
    }
  }

  async saveDetails() {
    const rememberMe = this.loginForm.get('rememberMe')!.value;

    localStorage.setItem(this.rememberMeLocalStorageName, rememberMe.toString());

    if(rememberMe) {
      
      // Encrypt the password
      const encryptionKey = await this.encryptionService.generateKey();
      const { encryptedData, iv } = await this.encryptionService.encrypt(
        this.loginForm.get('password')!.value,
        encryptionKey
      );

      const loginDetails = {
        username: this.loginForm.get('username')!.value,
        password: encryptedData,
        iv: iv,
      };

      localStorage.setItem(this.loginDetailsLocalStorageName, JSON.stringify(loginDetails));
      // Store the Base64 key in localStorage or IndexedDB
      localStorage.setItem(this.encryptionKeyStorageName, (await this.encryptionService.exportKeyAsBase64(encryptionKey)));
    } else {
      localStorage.removeItem(this.loginDetailsLocalStorageName);
    }
    
  }

  restoreDetails():any  {
    const storage = localStorage.getItem(this.loginDetailsLocalStorageName);
    if(CommonFunctions.isValid(storage)) {
      const loginDetails = JSON.parse(storage!);
      loginDetails.rememberMe = JSON.parse(localStorage.getItem(this.rememberMeLocalStorageName)!);
      return loginDetails;
    }
  }

  async autofillUserDetails() {
    const loginDetailsFromStorage = this.restoreDetails();
    
    if(CommonFunctions.isValid(loginDetailsFromStorage)) {
      const encryptionKey = await this.encryptionService.importKeyFromBase64(localStorage.getItem(this.encryptionKeyStorageName));
      
      const username = loginDetailsFromStorage.username;
      const iv = loginDetailsFromStorage.iv;
      const password = await this.encryptionService.decrypt(
        loginDetailsFromStorage.password,
        iv,
        encryptionKey
      );

      const rememberMe = loginDetailsFromStorage.rememberMe;

      this.loginForm.get('username')!.setValue(username);
      this.loginForm.get('password')!.setValue(password);
      this.loginForm.get('rememberMe')!.setValue(rememberMe);
    }
  }
  
  login() {
    try {
      this.alertService.closeAll();
      this.loginFailedError.set(LoginError.eNone);

      setTimeout(() => {
        this.loginForm.markAllAsTouched();
        if (!this.loginForm.invalid) {
          const loginInfo = {
            username: this.loginForm.get('username')!.value,
            password: this.loginForm.get('password')!.value
          }
          
          this.spinnerService.show(Spinkit.skLine);
          
          this.httpService.put('users/login', loginInfo)
            .subscribe({
              next: (data: any) => {
                this.onLoginCompleted(data);
              },
              error: (error) => {
                console.log('Error in login API', error);
                this.alertService.show(AlertSeverity.eError, 'Error connecting to the server');
                this.spinnerService.hide();
              }
            });
        }
      }, 100);


    } catch (ex) {
      console.log('Error in logging in', ex);

    }
  }

  async onLoginCompleted(data: any) {
    try {
      if (0 === data.code) {
        try {
          await this.saveDetails();
        } catch (ex) {
          console.log('Error saving username/password', ex);
        }
        this.userService.reportLogin(data);
        this.router.navigate(['/home']);
      } else {
        this.loginFailureErrorMsg = data.message;
        this.loginFailedError.set(data.code);
        console.log('Error', data.message+'-->'+data.code);
      }
      this.spinnerService.hide();
    } catch (ex) {
      console.log('Error in login', ex);
      
    }
  }

  async loginWithAzure() {
    try {
      if (!this.azureAuthService.isAzureAuthActive()) {
        this.alertService.show(AlertSeverity.eError, 'Azure login not ready yet');
        return;
      }
      (await this.azureAuthService.login()).subscribe({
        next: (data: any) => {
          this.exchangeToken(data.idToken);
        },
        error: err => console.error(err)
      });
    } catch (ex) {
      console.log('Error logging in with Azure', ex);
      this.alertService.show(AlertSeverity.eError, 'Failed loggin in with Azure');      
    }
  }

  exchangeToken(idToken: string) {
    this.httpService.putWithHeaders('users/azure-login', {}, {
      headers: {
        Authorization: `Bearer ${idToken}`
      }
    })
      .subscribe({
        next: (data: any) => {
          this.onLoginCompleted(data);
        },
        error: (error) => {
          console.log('Error in azure login API', error);
          this.alertService.show(AlertSeverity.eError, 'Error connecting to the server');
          this.spinnerService.hide();
        }
      });
  }

  FetchPreLoginData() {
    try {
      let attemptNo = 1;
      forkJoin({
        azureAdSettings: this.httpService.get('FKMgmt/GetAzureAdSettings'),
      })
        .pipe(
          tap({
            error: (err) => {
              console.log(`Attempt No. ${attemptNo++} failed`, err);
            },
          }),
          retry({ count: 10, delay: this.httpService.retryDelay }),
        )
        .subscribe({
          next: (data) => {
            this.onFetchCommonData_Success(data);
          },
          error: (er) => {
            this.spinnerService.hide();
            er.context = 'Error fetching Common data';
            this.httpService.reportAPICallFailure(er);
          }
        });
    } catch (ex) {
      console.log('Error calling Common Data API', ex);
      this.spinnerService.hide();
    }
  }

  onFetchCommonData_Success(data: any) {
    try {
      if (CommonFunctions.isValid(data.azureAdSettings)) {
        this.azureAuthService.setAzureAdSettings(data.azureAdSettings);
      }
      this.azureAuthActive = this.azureAuthService.isAzureAuthActive();
    } catch (ex) {
      console.log('Error reading pre login data', ex);
    } finally {
      console.log('Fetching pre login data finished');
    }
  }

}

enum LoginError {
  eNone = 0,
  eUserLockedout = 101,
  eInvalidPassword = 102,
  eInvalidUsername = 103,
};

