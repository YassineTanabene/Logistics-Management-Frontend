import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Import the Router service
import { navbarData } from './nav-data';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Import HttpClient and HttpHeaders

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  navData = navbarData;

  constructor(private router: Router, private http:HttpClient) {} // Inject the Router service

  ngOnInit() {}

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  navigateToHome() {
    // Use the Router service to navigate to the "Home" route
    this.router.navigate(['/home']);
  }
  navigateToPlanning() {
    // Use the Router service to navigate to the "planning" route
    this.router.navigate(['/planning']);
  }

  logout() {
    // Retrieve the user's token from storage (replace 'your_token_key' with the actual key you used)
    const userToken = localStorage.getItem('auth_token');
  
    if (!userToken) {
      // Handle the case where the token is not found (e.g., user not authenticated)
      console.error('Token not found. User may not be authenticated.');
      // Optionally, display an error message to the user
      return;
    }
  
    // Send a POST request to the Django logout API with the Authorization header
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${userToken}`
    });
  
    this.http.post<any>('http://localhost:8000/api/logout/', {}, { headers }).subscribe(
      (response) => {
        console.log('Logout successful:', response);
  
        // Clear the stored token when the user logs out
        localStorage.removeItem('auth-token');
  
        // After successful logout, navigate to the login page
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        // Handle logout error here
        console.error('Logout error:', error);
        // Optionally, display an error message to the user
      }
    );
    
  }
  

}
