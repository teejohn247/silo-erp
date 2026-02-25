import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = `${environment.apiBaseUrl}`;
  public readonly TOKEN_NAME = 'userToken';
  public _isLoggedin$ = new BehaviorSubject<boolean>(false);
  public isLoggedIn = this._isLoggedin$.asObservable();
  private userRoles: string[] = [];
  private userPermissions: string[] = [];
  private rolesSubject = new BehaviorSubject<string[]>([]);
  roles$ = this.rolesSubject.asObservable();
  
  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this._isLoggedin$.next(!!this.token);
  }

  get token() {
    return sessionStorage.getItem(this.TOKEN_NAME);
  }

  get loggedInUser() {
    const user = sessionStorage.getItem('loggedInUser');
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  public getUser(token: string) {
    return JSON.parse(atob(token.split('.')[1]))
  }

  public createAccount(payload:any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/signUp`, payload);
  }

  public verifyEmail(email:any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/forgotPassword?email=${email}`);
  }

  public verifyOtp(payload:any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/verifySignupOtp`, payload);
  }

  public setPassword(payload:any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/setPassword`, payload);
  }

  public setUserRolesPermissions(user:any) {
    if (user) {
      this.setUserContext({
        //role: user.roles,
        role: user.isSuperAdmin ? ['superAdmin'] : user.isManager ? ['manager'] : ['employee'],
        permissions: this.userPermissions
      });
    }
  }

  /** Set user context once (e.g. after login) */
  setUserContext(user: { role: string | string[], permissions?: string[] }) {
    this.userRoles = Array.isArray(user.role) ? user.role : [user.role];
    this.userPermissions = user.permissions ?? [];
    this.rolesSubject.next(this.userRoles); // notify subscribers
    //console.log('User Roles', this.userRoles);
    sessionStorage.setItem('userRoles', JSON.stringify(this.userRoles));
  }

  public login(payload:any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/signin`, payload).pipe(
      tap((res: any) => {
        this._isLoggedin$.next(true);
        sessionStorage.setItem(this.TOKEN_NAME, res.token);
        sessionStorage.setItem('loggedInUser', JSON.stringify(res.data));
        sessionStorage.setItem('userCheckedIn', JSON.stringify(false));
        sessionStorage.setItem('currency', JSON.stringify('$'));
        this.setUserRolesPermissions(res.data);
      })
    );
  }

  public logOut() {
    sessionStorage.removeItem(this.TOKEN_NAME);
    sessionStorage.removeItem('loggedInUser');
    sessionStorage.clear();
    this.router.navigate([`../login`]);
    sessionStorage.clear();
    // localStorage.clear();
    // setTimeout(()=> {
    //   window.location.reload();
    // }, 800)
  }
}
