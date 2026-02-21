export interface IPaging {
    page: number;
    pageSize: number;
    total?: number;
    search?: string;
    filters?: { [key: string]: any };
}

export type TableCellType =
    | 'text'
    | 'number'
    | 'currency'
    | 'date'
    | 'datetime'
    | 'time'
    | 'profile'
    | 'switch'
    | 'document'
    | 'custom'
    | 'status'
    | 'actions';

export interface TableColumn {
    key: string;
    label: string;
    type?: TableCellType;
    currencyCode?: string;
    frozen?: boolean; // freeze column left
    columnWidth?: string;
    cellStyle?: string;
    clickable?: boolean;
    order?:number;
    sortable?:boolean;
    statusMap?: { [key: string]: string };
    actions?: any
}

export type FilterType = 'select' | 'multiselect' | 'date' | 'daterange' | 'text'; 

export interface FilterOption { 
    value: string | number; 
    label: string; 
} 

export interface FilterConfig { 
    key: string; // API param key, e.g. "department" 
    label: string; // UI label 
    type: FilterType; // 'select' | 'daterange' etc. 
    options?: any; // for select/multiselect 
    placeholder?: string; 
    multiple?: boolean; // for multiselect 
    includeIfEmpty?: boolean; // whether to include param when empty 
    default?: any; // default value 
}