import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject } from 'rxjs';
import { User } from '../user/user.model';

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
  user = new Subject<User>();

  constructor(private http:HttpClient) { }

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
}
