import { MenuItem } from "@models/general/menu-item";

export const navMenuData: MenuItem[] = [
    {
        routeLink: 'hr/dashboard',
        icon: 'usersRound',
        label: 'Human Resources',
        mobileLabel: 'HR Module',
        subMenu: [
            { 
                routeLink: 'hr/dashboard', 
                icon: 'layoutDashboard', 
                label: 'Dashboard' 
            },
            { 
                routeLink: 'hr/employees', 
                icon: 'users', 
                label: 'Employees',
                roles: ['superAdmin']
            },
            { 
                routeLink: 'hr/self-service/overview', 
                icon: 'bi bi-person lg', 
                label: 'Profile',
                roles: ['manager', 'employee'] 
            },
            { 
                routeLink: 'hr/self-service/leave-requests', 
                icon: 'bi bi-person-fill', 
                label: 'Leave Requests',
                roles: ['manager', 'employee'] 
            },
            { 
                routeLink: 'hr/leave-management', 
                icon: 'palmTree', 
                label: 'Leave Management',
                roles: ['superAdmin', 'manager'] 
            },
            { 
                routeLink: 'hr/payroll', 
                icon: 'layers', 
                label: 'Payroll',
                roles: ['superAdmin'] 
            },
            { 
                routeLink: 'hr/self-service/payroll', 
                icon: 'bi bi-layers-fill', 
                label: 'Payroll',
                roles: ['manager', 'employee']
            },
            { 
                routeLink: 'hr/expense-management', 
                icon: 'bankNote', 
                label: 'Expense Management',
                roles: ['superAdmin', 'manager'] 
            },
            { 
                routeLink: 'hr/self-service/expense', 
                icon: 'bi bi-person-fill', 
                label: 'Expense Requests', 
                roles: ['manager', 'employee']
            },
            { 
                routeLink: 'hr/appraisals', 
                icon: 'userStar', 
                label: 'Appraisal Management',
                roles: ['superAdmin', 'manager'] 
            },
            { 
                routeLink: 'hr/self-service/appraisals', 
                icon: 'bi bi-journal-x', 
                label: 'Appraisal Requests',
                roles: ['manager', 'employee'] 
            },
            { 
                routeLink: 'hr/recruitment', 
                icon: 'briefcase', 
                label: 'Recruitment',
                roles: ['superAdmin'] 
            },
            { 
                routeLink: 'hr/calendar', 
                icon: 'calendarRange', 
                label: 'Calendar' 
            },
            { 
                routeLink: 'hr/attendance', 
                icon: 'bookUser', 
                label: 'Attendance' 
            },
            { 
                routeLink: 'hr/visitors-log', 
                icon: 'landmark', 
                label: 'Visitors Log' 
            }
        ]
    },
    {
        routeLink: 'crm',
        icon: 'fileUser',
        label: 'CRM',
        mobileLabel: 'CRM',
        roles: ['superAdmin', 'crmAgent'],
        subMenu: [
            { 
                routeLink: 'crm/dashboard', 
                icon: 'layoutDashboard', 
                label: 'Dashboard' 
            },
            { 
                routeLink: 'crm/contacts', 
                icon: 'contactRound', 
                label: 'Contacts' 
            },
            { 
                routeLink: 'crm/leads', 
                icon: 'shieldUser', 
                label: 'Leads' 
            },
            { 
                routeLink: 'crm/communication', 
                icon: 'megaphone', 
                label: 'Communication' 
            },
            { 
                routeLink: 'crm/calendar', 
                icon: 'calendarRange', 
                label: 'Calendar' 
            },
            { 
                routeLink: 'crm/support', 
                icon: 'headset', 
                label: 'Support' 
            },
            { 
                routeLink: 'crm/sales', 
                icon: 'scrollText', 
                label: 'Sales' 
            },
            { 
                routeLink: 'crm/agents', 
                icon: 'squareUser', 
                label: 'Agents' 
            },
            { 
                routeLink: 'crm/reports', 
                icon: 'lineChart', 
                label: 'Reports' 
            }
        ]
    },
    {
        routeLink: 'settings',
        icon: 'cog',
        label: 'Settings',
        mobileLabel: 'Settings',
        roles: ['superAdmin'], 
        subMenu: [
            { 
                routeLink: 'settings/general-settings', 
                icon: 'monitorCog', 
                label: 'General',
            },
            { 
                routeLink: 'settings/hr-settings', 
                icon: 'userCog', 
                label: 'Human Resources' 
            },
            { 
                routeLink: 'settings/crm-settings', 
                icon: 'folderCog', 
                label: 'CRM' 
            }
        ]
    }
];