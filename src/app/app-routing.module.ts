import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { PlanningComponent } from './planning/planning.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {path:'', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'sign-in', component: SignInComponent},
  {path: 'sign-up', component: SignUpComponent},
  {path: 'register-user', component:SignUpComponent},
  {path:'dashboard', component:DashboardComponent},
  {path: 'forgot-password', component:ForgotPasswordComponent},
  {path: 'verify-email-adress', component:VerifyEmailComponent},
  {path: 'sidebar',component:SidebarComponent},
  {path:'planning', component:PlanningComponent},
  {path:'home', component:HomeComponent},

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
