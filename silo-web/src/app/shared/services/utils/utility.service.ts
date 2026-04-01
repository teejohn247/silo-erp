import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { PermissionsService } from './permissions.service';
import { MenuItem } from '@models/general/menu-item';
import { navMenuData } from '@sharedWeb/constants/nav-menu';
import { Countries } from '@sharedWeb/constants/countries';
import { catchError, Observable, retry, tap, throwError } from 'rxjs';
import { NotificationService } from './notification.service';
import { Regions } from '@sharedWeb/constants/regions';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  navMenuData:MenuItem[] = navMenuData;

  regions = Regions;

  constructor(
    private location: Location,
    private notify: NotificationService,
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

  get currency(): any {
    let currency = sessionStorage.getItem('currency');

    if (currency) {
      // Try to parse JSON if it's an object
      try {
        const parsed = JSON.parse(currency);
        // Adjust according to stored structure
        currency = parsed.code || parsed.currencyCode || currency;
      } catch {
        // Not JSON, leave as is
      }

      const normalizedCurrency = currency?.trim().toUpperCase();
      const region = Regions.find(x => x.currencyCode.toUpperCase() === normalizedCurrency);

      //console.log('Currency:', currency, 'Matched region:', region);

      return region?.currencySymbol || '$';
    }

    return '$';
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

  get statusMap() {
    return {
      // string values
      active: 'active',
      Active: 'active',
      Approved: 'approved',
      Pending: 'pending',
      pending: 'pending',
      Declined: 'declined',
      checkedIn: 'checkedIn',
      checkedOut: 'checkedOut',

      // boolean values
      true: 'active',
      false: 'declined'
    }
  }

  get pieChartColorScheme() {
    return {
      domain: ['rgba(235, 87, 87, 0.7)', 'rgba(54, 171, 104, 0.7)', 'rgba(229, 166, 71, 0.7)', 'rgba(66, 133, 244, 0.7)', 'rgba(255, 150, 85, 0.7)']
    };
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
  
  /** Helper: format date as yyyy-MM-dd */
  formatDate(d: Date): string {
    // Use local date portion only
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  formatTimeFromISO(isoString: string): string {
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  combineDateTime(dateVal: Date, timeVal: string): Date {
    const result = new Date(dateVal);

    const match = timeVal.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) {
      throw new Error(`Invalid time format: ${timeVal}`);
    }

    let [, hours, minutes, meridiem] = match;
    let h = Number(hours);
    const m = Number(minutes);

    meridiem = meridiem.toUpperCase();

    if (meridiem === 'AM' && h === 12) h = 0;
    if (meridiem === 'PM' && h < 12) h += 12;

    result.setHours(h, m, 0, 0);
    return result;
  }

  /** Returns a yyyy-MM-dd date range covering today and the next day */
  buildDayRange(date: Date): { startDate: string; endDate: string } {

    // Start = today 00:00
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    // End = next day 23:59:59
    const end = new Date(date);
    end.setDate(end.getDate() + 1); // ✅ add 1 day
    end.setHours(23, 59, 59, 999);

    return {
      startDate: this.formatDate(start),
      endDate: this.formatDate(end)
    };
  }

  createCountryOptions(): Record<string, string> {
    const reqObj = Countries.reduce<Record<string, string>>((agg, item) => {
      agg[item.label] = item.label;
      return agg;
    }, {});

    return reqObj;
  }

  createRegionOptions(): Record<string, string> {
    const reqObj = Regions.reduce<Record<string, string>>((agg, item) => {
      agg[item._id] = item.name;
      return agg;
    }, {});

    return reqObj;
  }

  //GOOGLE LOCATION RELATED FUNCTIONS
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

  //GENERIC YEAR CHART SELECTIONS
  generateYearOptions(currentYear:any) {
    const chartYearOptions:any = {};
    for (let i = 0; i < 5; i++) {
      const year = currentYear - i;
      chartYearOptions[year] = year.toString();
    }

    return chartYearOptions;
  }

  getMonthlyAreaChartValues(data:any) {
    const monthOrder = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return monthOrder.map(month => data[month] || 0);
  }

  //Convert string to camel case
  toCamelCase(str:string){
    return str.split(' ').map(function(word,index){
      // If it is the first word make sure to lowercase all the chars.
      if(index == 0){
        return word.toLowerCase();
      }
      // If it is not the first word only upper case the first char and lowercase the rest.
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join('');
  }

  //Convert string from camel case
  fromCamelCase(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  //Calculate age from date of birth
  calculateAge(dateOfBirth: string | Date): number {
    const dob = new Date(dateOfBirth);
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();

    const monthDiff = today.getMonth() - dob.getMonth();

    // If birthday hasn't occurred yet this year
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < dob.getDate())
    ) {
      age--;
    }

    return age;
  }

  //Prepare table to export to CSV
  exportToCsv(
    rows: any[],
    exportFields: string[],
    fileName?: string,
    fieldFormatters?: { [key: string]: (value: any) => string }
  ) {
    if (!rows?.length) {
      this.notify.showError('No data to export')
      return;
    }

    // Headers
    const headers = exportFields.map(f => this.fromCamelCase(f));
    const csvRows = [headers.join(',')];

    rows.forEach(row => {
      const values = exportFields.map(field => {
        let value = row[field];

        // Apply custom formatter if exists
        if (fieldFormatters?.[field]) {
          value = fieldFormatters[field](value);
        } else if (value === null || value === undefined) {
          value = '';
        } else {
          value = String(value);
        }

        // Escape quotes
        return `"${value.replace(/"/g, '""')}"`;
      });

      csvRows.push(values.join(','));
    });

    const csvString = csvRows.join('\n');
    this.downloadCsv(csvString, fileName);
  }

  getFieldValue(obj: any, path: string): any {
    if (!obj || !path) return '';
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  // Download CSV
  downloadCsv(csv: string, fileName?: string) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName ?? `export-${new Date().toISOString()}.csv`;
    link.click();

    window.URL.revokeObjectURL(url);
  }

  //Add Color Status Theme
  mapThemeToData(
    dataArray: any,
    stages: any[],
    targetProp: string,
  ): any[] {
    // Create a quick lookup map: stageKey -> themeKey
    const themeMap: Record<string, any> = {};
    stages.forEach(stage => {
      themeMap[stage.name] = stage.theme;
    });

    // Return a new array with the new property added
    return dataArray.map((item:any) => ({
      ...item,
      colorStatusTheme: themeMap[item[targetProp]] || 'default' // fallback if no match
    }));
  }

  //Generate Kanban board items
  transformKanbanItems(items: any[], stages: any[]) {
    return items.map((item, index) => {
      // Find matching stage
      const stage = stages.find(s => s.name === item.stage);

      return {
        id: item._id || String(index + 1),
        stageId: stage ? String(stage._id) : '',
        theme: stage ? stage.theme : 'blue',
        data: item // ✅ keep original object unchanged
      };
    });
  }

}