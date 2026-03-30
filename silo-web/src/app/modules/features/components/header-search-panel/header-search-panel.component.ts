import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CrmService } from '@services/crm/crm.service';
import { HrService } from '@services/hr/hr.service';
import { FormControl } from '@angular/forms';
import { catchError, debounceTime, of, switchMap, takeUntil, tap, Subject, filter } from 'rxjs';
import { AuthService } from '@services/utils/auth.service';

@Component({
  selector: 'app-header-search-panel',
  templateUrl: './header-search-panel.component.html',
  styleUrls: ['./header-search-panel.component.scss']
})
export class HeaderSearchPanelComponent implements OnInit, OnDestroy {
  loggedInUser: any;
  searchControl = new FormControl('');
  unsubscribe$ = new Subject<void>();

  searchResponse: any[] = [];
  isLoading = false;
  showPanel = false;

  currentModule: 'hr' | 'crm' = 'hr';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private hrService: HrService,
    private crmService: CrmService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.authService.loggedInUser;
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.unsubscribe$)
    )
    .subscribe(() => {
      this.currentModule = this.getModule();
      this.searchResponse = [];
    });

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      tap(value => {
        this.showPanel = !!value?.trim();
        this.isLoading = !!value?.trim();
      }),
      switchMap(value => {
        const search = value?.trim() || '';
        // Only search if input length >= 3
        // if (search.length < 3) {
        //   return of({ data: [] });
        // }
        return this.searchApi(search).pipe(
          catchError(() => of({ data: [] }))
        );
      }),
      takeUntil(this.unsubscribe$)
    )
    .subscribe(res => {
      this.searchResponse = res.data || res;
      console.log('Search Res', this.searchResponse)
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getModule(): 'hr' | 'crm' {
    const url = this.router.url;
    if (url.includes('/hr/')) return 'hr';
    if (url.includes('/crm/')) return 'crm';
    return 'hr';
  }

  searchApi(search: string) {
    switch (this.currentModule) {
      case 'hr':
        return this.hrService.getEmployees(1, 10, search, {});
      case 'crm':
        return this.crmService.getContacts(1, 10, search, {});
      default:
        return of({ data: [] });
    }
  }

  clearSearch() {
    this.searchControl.setValue('');
    this.searchResponse = [];
    this.showPanel = false;
    this.isLoading = false;
  }

  viewRow(info:any) {
    if(this.loggedInUser.isSuperAdmin && this.currentModule === 'hr') {
      this.router.navigateByUrl(`/app/hr/employees/${info._id}`);
      this.clearSearch();
    }
  }

}