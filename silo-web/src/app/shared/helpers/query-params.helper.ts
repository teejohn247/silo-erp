// query-params.helper.ts

import { HttpParams } from '@angular/common/http';

export type ParamPrimitive = string | number | boolean;
export type ParamArray = Array<string | number | boolean>;
export type ParamDateRange = { start?: string | null; end?: string | null };
export type ParamValue = ParamPrimitive | ParamArray | ParamDateRange | null | undefined;

function isDateRange(v: any): v is ParamDateRange {
  return v && typeof v === 'object' && ('start' in v || 'end' in v);
}

/**
 * Convert a params object into a query string.
 * - Arrays become comma separated values key=a,b,c
 * - Date range objects {start,end} become keyStartDate=... & keyEndDate=...
 * - Skips null, undefined, empty string, and empty arrays by default
 */
export function toQueryString(params: { [k: string]: ParamValue } = {}, opts?: { includeEmpty?: boolean }): string {
    const includeEmpty = !!opts?.includeEmpty;
    const parts: string[] = [];

    Object.keys(params || {}).forEach(key => {
        const val = params[key];

        if (val === null || val === undefined) {
        if (includeEmpty) parts.push(`${encodeURIComponent(key)}=`);
            return;
        }

        if (typeof val === 'string' && val.trim() === '') {
        if (includeEmpty) parts.push(`${encodeURIComponent(key)}=`);
            return;
        }

        if (Array.isArray(val)) {
        if (val.length === 0) {
            if (includeEmpty) parts.push(`${encodeURIComponent(key)}=`);
            return;
        }
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(val.join(','))}`);
            return;
        }

        if (isDateRange(val)) {
            if (val.start) parts.push(`${encodeURIComponent(key + 'StartDate')}=${encodeURIComponent(String(val.start))}`);
            if (val.end) parts.push(`${encodeURIComponent(key + 'EndDate')}=${encodeURIComponent(String(val.end))}`);
            return;
        }

        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(val))}`);
    });

    return parts.join('&');
}

/**
 * Build a full URL by appending a query string to baseUrl.
 * If params is empty returns baseUrl unchanged.
 */
export function buildUrlWithParams(baseUrl: string, params?: { [k: string]: ParamValue }, opts?: { includeEmpty?: boolean }): string {
    if (!params || Object.keys(params).length === 0) return baseUrl;
    const qs = toQueryString(params, opts);
    return qs ? `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}${qs}` : baseUrl;
}

/**
 * Build Angular HttpParams from the params object.
 * Useful when you prefer HttpClient params option instead of building a URL string.
 */
export function buildHttpParams(params: { [k: string]: ParamValue } = {}, opts?: { includeEmpty?: boolean }): HttpParams {
    let httpParams = new HttpParams();
    const includeEmpty = !!opts?.includeEmpty;

    Object.keys(params || {}).forEach(key => {
        const val = params[key];

        if (val === null || val === undefined) {
        if (includeEmpty) httpParams = httpParams.set(key, '');
        return;
        }

        if (typeof val === 'string' && val.trim() === '') {
        if (includeEmpty) httpParams = httpParams.set(key, '');
        return;
        }

        if (Array.isArray(val)) {
        if (val.length === 0) {
            if (includeEmpty) httpParams = httpParams.set(key, '');
            return;
        }
        httpParams = httpParams.set(key, val.join(','));
        return;
        }

        if (isDateRange(val)) {
        if (val.start) httpParams = httpParams.set(`${key}StartDate`, String(val.start));
        if (val.end) httpParams = httpParams.set(`${key}EndDate`, String(val.end));
        return;
        }

        httpParams = httpParams.set(key, String(val));
    });

    return httpParams;
}

/**
 * Normalize filter state coming from UI
 * - removes null/undefined/empty-string/empty-array
 * - converts date range objects into keyStartDate and keyEndDate
 * - leaves arrays as arrays so the builder can join them
 */
export function normalizeFiltersForApi(filters: { [k: string]: any } = {}): { [k: string]: any } {
    const out: { [k: string]: any } = {};
    Object.keys(filters || {}).forEach(k => {
        const v = filters[k];

        if (v === null || v === undefined) return;
        if (typeof v === 'string' && v.trim() === '') return;
        if (Array.isArray(v) && v.length === 0) return;

        if (isDateRange(v)) {
        if (v.start) out[`${k}StartDate`] = v.start;
        if (v.end) out[`${k}EndDate`] = v.end;
            return;
        }

        out[k] = v;
    });
    return out;
}
