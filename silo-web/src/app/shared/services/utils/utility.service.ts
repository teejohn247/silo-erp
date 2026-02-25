import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { PermissionsService } from './permissions.service';
import { MenuItem } from '@models/general/menu-item';
import { navMenuData } from '@sharedWeb/constants/nav-menu';
import { Countries } from '@sharedWeb/constants/countries';
import { catchError, Observable, retry, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  navMenuData:MenuItem[] = navMenuData;

  constructor(
    private location: Location,
    private readonly permissionsService: PermissionsService
  ) {
    const user = this.loggedInUser;
    if (user) {
      this.permissionsService.setUserContext({
        //role: user.roles,
        role: user.isSuperAdmin ? ['superAdmin'] : user.isManager ? ['manager'] : ['employee'],
        permissions: this.userPermissions
      });
    }
  }

  get loggedInUser() {
    const user = sessionStorage.getItem('loggedInUser');
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  get currency() {
    const currency = sessionStorage.getItem('currency');
    if (currency) {
      return JSON.parse(currency);
    }
    return 'NGN';
  }

  get userRoles() {
    const userRoles = sessionStorage.getItem('userRoles');
    if (userRoles) {
      return JSON.parse(userRoles);
    }
    return null;
  }

  get userPermissions() {
    const userPermission = sessionStorage.getItem('permissions');
    if (userPermission) {
      return JSON.parse(userPermission);
    }
    return null;
  }

  get userMenu() {
    return this.setupUserMenu()
  }

  goBack() {
    this.location.back();
  }
  
  private setupUserMenu(): MenuItem[] {
    return this.assignMenuPermissions(this.navMenuData)
  }

  private assignMenuPermissions(menu: MenuItem[]): MenuItem[] {
    return menu.map(item => {
      const hasRole = this.permissionsService.hasRole(item.roles, this.userRoles);
      //If no permission key, it is open to all
      const hasPermission = hasRole && (item.permissionKey ? this.permissionsService.hasPermission(item.permissionKey) : true);

      //console.log(item.label, hasPermission)

      const newItem: MenuItem = {
        ...item,
        permission: hasPermission
      };

      if (item.subMenu) {
        newItem.subMenu = this.assignMenuPermissions(item.subMenu);
      }

      return newItem;
    });
  }

  hasActiveModule(modules = this.loggedInUser.companyFeatures.modules): boolean {
    return Object.values(modules).some((module:any) => module.active);
  }

  //Converts an array to an Object of key value pairs
  arrayToObject(arrayVar:any[], key:string) {
    let reqObj = {}
    reqObj = arrayVar.reduce((agg, item, index) => {
      agg[item['_id']] = item[key];
      return agg;
    }, {})
    return reqObj;
  }

  createCountryOptions(): Record<string, string> {
    const reqObj = Countries.reduce<Record<string, string>>((agg, item) => {
      agg[item.label] = item.label;
      return agg;
    }, {});

    return reqObj;
  }

  getCurrentLocation() {
    return new Observable<GeolocationCoordinates>((observer) => {
      window.navigator.geolocation.getCurrentPosition(
        (position) => {
          observer.next(position.coords);
          observer.complete();
        },
        (err) => observer.error(err)
      );
    }).pipe(
      retry(1),
      tap(() => {
          console.log('Got your location');
        }
      ),
      catchError((error) => {
        console.log('failed to get your location');
        return throwError(error);
      })
    );
  }

  _getDistanceFromLatLonInKm(position1: [number, number], position2: [number, number]) {
    const [lat1, lon1] = position1;
    const [lat2, lon2] = position2;
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    const dLon = this.deg2rad(lon2-lon1);
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in km
    return d;
  }
  
  deg2rad(deg: number) {
    return deg * (Math.PI/180)
  }
  
  distanceToString = (distance: number): string => {
    if(distance <= 1) return Math.round(distance * 1000) + 'm';
    else if(distance > 1000) return distance.toFixed(0) + 'km';
    else if(distance > 100) return distance.toFixed(1) + 'km';
    else if(distance > 10) return distance.toFixed(2) + 'km';
    else if(distance > 1) return distance.toFixed(3) + 'km';
    return '--';
  }
  
  getDistanceFromLatLonInKm = (position1: [number, number] | null, position2: [number, number]) => {
    if(position1 !== null) {
      const distance = this._getDistanceFromLatLonInKm(position1, position2);
      return this.distanceToString(distance);
    }
    return '--';
  }

}