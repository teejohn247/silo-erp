import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  private userRoles: string[] = [];
  private rolesSubject = new BehaviorSubject<string[]>([]);
  roles$ = this.rolesSubject.asObservable();

  private userPermissions: string[] = [];

  /** Set user context once (e.g. after login) */
  setUserContext(user: { role: string | string[], permissions?: string[] }) {
    this.userRoles = Array.isArray(user.role) ? user.role : [user.role];
    this.userPermissions = user.permissions ?? [];
    this.rolesSubject.next(this.userRoles); // notify subscribers
  }

  /** Check if user has a specific permission key */
  hasPermission(permissionKey?: string): boolean {
    if (!permissionKey) return false;
    return this.userPermissions.includes(permissionKey);
  }

  /** Check if user has any of the allowed roles */
  hasRole(roles?: string[], userRoles?:any): boolean {
    //console.log('Checking', userRoles);
    if (!roles || roles.length === 0) return true;
    //console.log('Check done', roles.some(role => userRoles.includes(role)));
    return roles.some(role => userRoles.includes(role));
  }
}