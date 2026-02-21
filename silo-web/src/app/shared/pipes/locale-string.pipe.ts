import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'localeString'
})
export class LocaleStringPipe implements PipeTransform {

    transform(value: number | string | null | undefined): string {
        if (value === null || value === undefined) return '';

        const num = Number(value);

        // If it's not a valid number, return the original value unchanged
        if (isNaN(num)) return String(value);

        return num.toLocaleString();
    }
}
