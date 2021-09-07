import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import firebase from 'firebase/app'
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from 'rxjs/operators';

const headers_object = new HttpHeaders();
headers_object.append("Content-Type", "application/json");
// headers_object.append("Authorization", "Basic " + btoa("client:client"));
headers_object.append("Access-Control-Allow-Origin", "*");

@Injectable()
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  url = "http://www.monitorproyecto.com:8080/api/v1";

  constructor(private http: HttpClient, public router: Router) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem("token"))
    );

    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  signupUser(username: string, password: string) {
    //your code for signing up the new user
  }

  signinUser(username: string, password: string) {
    const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
    return this.http
      .post<any>(`${this.url}/auth/login`, { username, password }, {headers})
      .pipe(
        map((user) => {
          // console.log(user);
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          if (user.idToken) {
            localStorage.setItem("token", JSON.stringify(user.idToken));
            this.currentUserSubject.next(user.idToken);
          }
          return user;
        })
      );

  }

  logout() {
    localStorage.removeItem("token");
    this.currentUserSubject.next(null);
    this.router.navigate(["./pages/login"]);
  }

  isAuthenticated() {
    return true;
  }
}
