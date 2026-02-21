import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'timeDuration'
})
export class TimeDurationPipe implements PipeTransform {

    transform(value: any): string {
        if (!value) return '';

        const now = new Date();
        const date = new Date(value);

        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);

        const isToday = date.toDateString() === now.toDateString();

        const yesterday = new Date();
        yesterday.setDate(now.getDate() - 1);
        const isYesterday = date.toDateString() === yesterday.toDateString();

        // -------------------------
        // 0–10 minutes → exact minutes
        // -------------------------
        if (diffMins < 10) {
            return `${diffMins} min${diffMins === 1 ? '' : 's'} ago`;
        }

        // -------------------------
        // 10–60 minutes → round to nearest 10
        // -------------------------
        if (diffMins < 60) {
            const rounded = Math.floor(diffMins / 10) * 10;
            return `${rounded} mins ago`;
        }

        // -------------------------
        // 1–5 hours → show hours
        // -------------------------
        if (diffHours < 5) {
            return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
        }

        // -------------------------
        // Same day but >5 hours → show time only
        // -------------------------
        if (isToday) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        // -------------------------
        // Yesterday → "Yesterday, 12:34 PM"
        // -------------------------
        if (isYesterday) {
            const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return `Yesterday, ${time}`;
        }

        // -------------------------
        // Older → show date + time
        // -------------------------
        return date.toLocaleString([], {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}
