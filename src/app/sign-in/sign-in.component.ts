import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'] 
})

export class SignInComponent {
  constructor(private http: HttpClient, private router: Router) {}

  user = {
    email: '',
    password: ''
  };
  emailEmpty = false;
  passwordEmpty = false;
  accountnotExists = false;
  loginsuccess = false;
  hideAlerts() {
    setTimeout(() => {
      this.emailEmpty = false;
      this.passwordEmpty = false;
      this.accountnotExists = false;
      this.loginsuccess = false;
    }, 3000); // 3000 milliseconds (3 seconds)
  }

  login() {
    this.emailEmpty = false;
    this.passwordEmpty = false;

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

    const loginData = {
      email: this.user.email,
      password: this.user.password
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.http.post<any>('http://127.0.0.1:8000/api/login/', loginData, { headers }).subscribe(
      (response) => {
        console.log('Login successful:', response);

        // Capture the token from the response and store it securely
        const authToken = response.token; // Adjust this based on your server's response structure
        localStorage.setItem('auth_token', authToken); // Store it in local storage
        this.emailEmpty = false;
        this.passwordEmpty = false;
        this.accountnotExists = false;
        this.loginsuccess=true;
        this.hideAlerts();

        // Redirect to another page after successful login
        setTimeout(() => {
          // Redirect to login page after 2 seconds
          this.router.navigate(['/planning']);
        }, 1000); // 1000 milliseconds (2 seconds)        
      },
      (error) => {
        // Handle login error here
        console.error('Login error:', error);
        // You can display an error message to the user if needed
        if (error.status === 401 ) {
          this.accountnotExists = true;
          this.hideAlerts();

        }

      }
    );
  }
}
