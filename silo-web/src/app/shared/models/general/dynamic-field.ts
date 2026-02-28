import { ValidatorFn } from "@angular/forms";

export interface DynamicField {
    controlName: string,
    controlType: 'text' | 'textarea' | 'number' | 'select' | 'mutipleSelect' | 'date' | 'time' | 'file',
    controlLabel: string,
    controlWidth: string,
    initialValue: any,
    placeholder?: string,
    readonly?: boolean,
    selectOptions?: {[key: string]: string},
    validators?: ValidatorFn[] | null,
    order: number,
    onBlur?: (value: any, field: DynamicField) => void;
}

export interface DynamicFormButton {
    key: string;
    label: string;
    class?: string;
    type?: 'submit' | 'button';
}

export interface DynamicFormAction {
    buttonKey: string;
    value: any;
}
