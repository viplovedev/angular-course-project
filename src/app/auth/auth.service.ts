import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { User } from '../user/user.model';
import { Router } from '@angular/router';

export interface AuthResponse{
  idToken:string;
  email:string;
  refreshToken:string;
  expiresIn:string;
  localId:string;
  registered?:boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  logOutTimer: NodeJS.Timer;

  constructor(
    private http:HttpClient,
    private router:Router
    ) { }

  signup(email:string,password:string){
    return this.http.post<AuthResponse>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAIDQddBm5q2d7CNNrhcXypHi4acRZFrQo',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(
      catchError(this.handleError),
      tap(resData => 
        this.handleAuthentication(
          resData.email,
          resData.localId,
          resData.idToken,
          +resData.expiresIn
        )
      )
    )
  }

  login(email:string,password:string){
    return this.http.post<AuthResponse>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAIDQddBm5q2d7CNNrhcXypHi4acRZFrQo',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(
      catchError(this.handleError),
      tap(resData => 
        this.handleAuthentication(
          resData.email,
          resData.localId,
          resData.idToken,
          +resData.expiresIn
        )
      )
    )
  }

  autoLogin(){
    const userData:{
      email: string,
      id: string,
      _token:string,
      _tokenExpirationDate: Date
    } = JSON.parse(localStorage.getItem('userData'))
   
    if(!userData){
      return;
    }

    if(!userData._token){
      return;
    }
    
    const loadedUser = new User(
      userData.email, 
      userData.id, 
      userData._token, 
      userData._tokenExpirationDate
    );
    this.user.next(loadedUser);
  }

  private handleAuthentication(
    email:string,
    localId:string,
    token:string,
    expiresIn:number
    ){
    {
      const expirationDate = new Date(
        new Date().getTime() + expiresIn*1000
      );
      const user = new User(
        email,
        localId,
        token,
        expirationDate
      );
      this.user.next(user);
      localStorage.setItem('userData',JSON.stringify(user));
      const dummyExpirationDate = new Date();
      dummyExpirationDate.setSeconds(new Date().getSeconds()+5)
      this.autoLogout(dummyExpirationDate);
    }
  }

  private handleError(errorRes:HttpErrorResponse){
    let errorMessage = "An unknown error occurred!";
    if(!errorRes.error || !errorRes.error.error){
      return throwError(errorMessage);
    }
    switch(errorRes.error.error.message){
      case 'EMAIL_EXISTS':{
        errorMessage = "The email already exists!";
        break;
      }
      case 'EMAIL_NOT_FOUND':{
        errorMessage = "The email does not exist!";
        break;
      }
      case 'INVALID_PASSWORD':{
        errorMessage = "The password is not correct.";
        break;
      }
    }
    return throwError(errorMessage);
  }

  logout(){
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    clearTimeout(this.logOutTimer);
    this.logOutTimer = null;
  }

  autoLogout(logoutDate:Date){
    /**
     * calculate the remaining time from the @logoutDate
     * set timer to the remaining time and logout
     */
    const millisecondsRemaining = logoutDate.getTime() - new Date().getTime();
    this.logOutTimer = setTimeout(()=>{this.logout()}, millisecondsRemaining);
  }
}
