import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateWords'
})
export class TruncateWordsPipe implements PipeTransform {

    transform(value: string, limit: number = 20): string {
        if (!value) return '';

        // Remove HTML tags
        const text = value.replace(/<[^>]+>/g, '');

        const words = text.split(/\s+/);

        if (words.length <= limit) {
            return text;
        }

        return words.slice(0, limit).join(' ') + '…';
    }
}
