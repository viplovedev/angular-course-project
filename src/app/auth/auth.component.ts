import { AuthService, AuthResponse } from './auth.service';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  isLoginMode = true;
  isLoading = false;
  error;
  authObs: Observable<AuthResponse>;

  constructor(
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    
    this.isLoading = true;
    if (form.valid) {
      if (this.isLoginMode) {
        this.authObs = this.authService.login(form.value.email, form.value.password);
      } else {
        this.authObs = this.authService.signup(form.value.email, form.value.password);
      }
    }
    console.log("Timer being set parallelly ...");
    console.log(this.authService.testString);
    this.authObs.subscribe(
      response => {
        this.isLoading = false;
        console.log(response);
        this.router.navigate(['./recipes']);
      },
      errorRes => {
        this.isLoading = false;
        this.error = errorRes;
        console.log("errorRes: " + errorRes);
        console.log("error: " + this.error);
      }
    )
    form.reset();
  }
}
