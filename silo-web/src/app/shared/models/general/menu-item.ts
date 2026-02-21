export interface MenuItem {
    routeLink: string;
    icon: any;
    label: string;
    mobileLabel?: string;
    subMenu?: MenuItem[];
    permissionKey?: string;
    roles?: string[]; 
    permission?: boolean;
}
