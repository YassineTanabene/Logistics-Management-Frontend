import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  constructor(private http: HttpClient, private router: Router) {}

  user = {
    email: '',
    password: ''
  };

  emailEmpty = false;
  passwordEmpty = false;
  emailExists = false;
  registersuccess = false;

  hideAlerts() {
    setTimeout(() => {
      this.emailEmpty = false;
      this.passwordEmpty = false;
      this.emailExists = false;
      this.registersuccess = false;
    }, 3000); // 3000 milliseconds (3 seconds)
  }
  register() {
    this.emailEmpty = false;
    this.passwordEmpty = false;
    this.emailExists = false;

    if (!this.user.email && !this.user.password) {
      this.emailEmpty = true;
      this.passwordEmpty = true;
      this.hideAlerts();

      return;
    }
    if (!this.user.email) {
      this.emailEmpty = true;
      this.hideAlerts();

      return;
    }

    if (!this.user.password) {
      this.passwordEmpty = true;
      this.hideAlerts();

      return;
    }

    const registerData = {
      email: this.user.email,
      password: this.user.password
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.http.post<any>('http://127.0.0.1:8000/api/register/', registerData, { headers }).subscribe(
      (response) => {
        console.log('Registration successful:', response);
        this.emailEmpty = false;
        this.passwordEmpty = false;
        this.emailExists = false;
        this.registersuccess = true;
        this.hideAlerts();
        // Redirect to login page after successful registration
        setTimeout(() => {
          this.router.navigate(['/sign-in']);
        }, 2000); 
      },
      (error) => {
        // Handle the registration error
        console.error('Registration error:', error);

        if (error.status === 400 ) {
          this.emailExists = true;
          this.hideAlerts();

        }
      }
    );
  }
}
