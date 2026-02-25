import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { UtilityService } from '@services/utils/utility.service';
import { PermissionsService } from '@sharedWeb/services/utils/permissions.service';
import { Subscription } from 'rxjs';

@Directive({
    selector: '[hasRole]'
})
export class HasRoleDirective implements OnInit, OnDestroy {

    private allowedRoles: string[] = [];
    private sub!: Subscription;

    @Input()
    set hasRole(roles: string[] | string) {
        this.allowedRoles = Array.isArray(roles) ? roles : [roles];
        this.updateView();
    }

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private permissionsService: PermissionsService,
        private utitlityService: UtilityService
    ) {}

    ngOnInit(): void {
        // subscribe to role changes
        this.sub = this.permissionsService.roles$.subscribe(() => {
            this.updateView();
        });
    }

    ngOnDestroy(): void {
        this.sub?.unsubscribe();
    }

    private updateView(): void {
        this.viewContainer.clear();
        //console.log(this.allowedRoles);
        if (this.permissionsService.hasRole(this.allowedRoles, this.utitlityService.userRoles)) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        }
    }
}