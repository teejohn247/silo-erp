import { Injectable } from '@angular/core';
import { PermissionsService } from './permissions.service';
import { MenuItem } from '@models/general/menu-item';
import { navMenuData } from '@sharedWeb/constants/nav-menu';
import { Countries } from '@sharedWeb/constants/countries';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  navMenuData:MenuItem[] = navMenuData;

  constructor(
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

  private setupUserMenu(): MenuItem[] {
    return this.assignMenuPermissions(this.navMenuData)
  }

  private assignMenuPermissions(menu: MenuItem[]): MenuItem[] {
    return menu.map(item => {
      const hasRole = this.permissionsService.hasRole(item.roles);
      //If no permission key, it is open to all
      const hasPermission = hasRole && (item.permissionKey ? this.permissionsService.hasPermission(item.permissionKey) : true);

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

}