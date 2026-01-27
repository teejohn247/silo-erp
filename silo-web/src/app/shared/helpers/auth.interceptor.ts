import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class Interceptor implements HttpInterceptor {
    constructor(private notificationService: ToastrService) {
        console.log('Interceptor constructed');
    }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        console.log('Intercept called:', request.url);

        // Optional: add Authorization header here
        request = request.clone({
            setHeaders: {
                // Authorization: `Bearer ${yourToken}`
            }
        });

        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                // Ignore specific URLs
                if (error?.url?.includes('ipapi')) {
                    return throwError(() => error);
                }

                // Handle HTTP error codes
                switch (error.status) {
                    case 401:
                        this.notificationService.warning(
                        'Your session has expired. Please login once again.',
                        'Session Expired'
                        );
                        break;

                    case 403:
                        this.notificationService.warning(
                        'You do not have access to that',
                        'Unauthorized'
                        );
                        break;

                    default:
                        const message =
                        error?.error?.error ??
                        'An unexpected error occurred. Please try again.';
                        this.notificationService.error(message, 'Failed');
                        console.error(error.error);
                }

                // Propagate error downstream
                return throwError(() => error);
            })
        );
    }
}
