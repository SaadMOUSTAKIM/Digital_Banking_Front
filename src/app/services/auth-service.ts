import { Injectable } from '@angular/core';
import { UserModel } from '../models/user.model';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {StorageService} from "./storage.service";

import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpBackend, HttpContext
} from '@angular/common/http';
import { Router } from '@angular/router';
import {BYPASS_LOG} from "./authconfig.interceptor";
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  endpoint: string = 'http://localhost:8085';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser :any;

  constructor(private http: HttpClient, public router: Router,public storageService:StorageService) {}
  // Sign-up
  signUp(user: UserModel): Observable<any> {
    let api = `${this.endpoint}/register-user`;
    return this.http.post(api, user).pipe(catchError(this.handleError));
  }


  // Sign-in
  login(username:string, password:string) {
    const body = {
      "username": username,
      "password":password
    };
    console.log(body)
    this.http
      .post<any>(`${this.endpoint}/login`, body,{ context: new HttpContext().set(BYPASS_LOG, true) })
      .subscribe((res: any) => {
        if(res.accessT){
          console.log(res.accessT)
          var json = JSON.parse(res.user);
          console.log(json)
          this.currentUser = json;
          this.storageService.saveUser(json);
          this.storageService.saveToken(res.accessT)
          this.storageService.saveRefreshToken(res.refreshT);
          console.log(res.user)

        }else {
          this.storageService.saveUser(null);
        }
      });
    return this.storageService.getUser();
  }
  getToken() {
    return this.storageService.getToken();
  }
  get isLoggedIn(): boolean {
    let authToken = this.storageService.getToken();
    return authToken !== null ? true : false;
  }
  doLogout() {
    let removeUser = this.storageService.dologout();
    if (removeUser == null) {
      this.router.navigate(['login']);
    }
  }
  // UserModel profile
  getUserProfile(id: any): Observable<any> {
    let api = `${this.endpoint}/auth/profile/${id}`;
    return this.http.get(api, { headers: this.headers }).pipe(
      map((res) => {
        return res || {};
      }),
      catchError(this.handleError)
    );
  }

  refreshToken(token: string) {
    // let header = new HttpHeaders().set("Authorization", 'Bearer ' + token);
    // let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + token});
    let heade =  {headers: new  HttpHeaders({ 'Authorization': 'Bearer ' + token})};
    // @ts-ignore
    return this.http.post(this.endpoint + '/auth/refreshToken',{ headers: this.headers },heade);
  }
  getRole(){
    console.log(this.storageService.getUser().appRoles)
    return this.storageService.getUser().appRoles;
  }

  // Error
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }

}
