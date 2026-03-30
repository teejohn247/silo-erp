import { ValidatorFn } from "@angular/forms";

export interface DynamicField {
    controlName: string,
    controlType: 'text' | 'textarea' | 'number' | 'select' | 'mutipleSelect' | 'date' | 'time' | 'file' | 'quillEditor' | 'rangeSlider',
    controlLabel: string,
    controlWidth: string,
    initialValue?: any,
    placeholder?: string,
    disabled?: boolean,
    hidden?: boolean,
    readonly?: boolean,
    selectOptions?: {[key: string]: string},
    validators?: ValidatorFn[] | null,
    order: number,
    onBlur?: (value: any, field: DynamicField) => void;

    numberMax?:any,
    rangeMin?: number,
    rangeMax?: number,
    rangeStep?: number,
    rangePrefix?: string,
    rangeSuffix?: string
}

export interface DynamicFormButton {
    key: string;
    label: string;
    class?: string;
    type?: 'submit' | 'button';
    visible?: boolean
}

export interface DynamicFormAction {
    buttonKey: string;
    value: any;
}
