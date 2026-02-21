import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalModalComponent } from '@modals/global-modal/global-modal.component';
import { Observable, Subject } from 'rxjs';

export interface ModalResult<T = any> {
  action: 'submit' | 'cancel' | 'close';
  dirty: boolean;
  payload?: T;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(
    private dialog: MatDialog
  ) {}

  open(component: any, data?: any): Observable<any> {
    const result$ = new Subject<ModalResult>();

    const dialogRef = this.dialog.open(GlobalModalComponent, {
      width: data.width ?? '40%',
      panelClass: 'custom-modal',
      data: {
        component,
        data,
        onSubmit: (output: any) => {
          result$.next({
            action: 'submit',
            dirty: true,
            payload: output
          });
          result$.complete();
          dialogRef.close();
        }
      }
    });
    
    dialogRef.afterClosed().subscribe(() => {
      if (!result$.closed) {
        result$.next({ action: 'cancel', dirty: false });
        result$.complete();
      }
    });

    return result$.asObservable();
  }
}
