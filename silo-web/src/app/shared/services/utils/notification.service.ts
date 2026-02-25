import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WorkLocationComponent } from '@hr/attendance/work-location/work-location.component';
import { ConfirmationModalComponent } from '@modals/confirmation-modal/confirmation-modal.component';
import { ConfirmationDialogData } from '@models/general/dialog-data';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private toastr: ToastrService, 
    private dialog: MatDialog
  ) { }

  showSuccess(message: string = "Successful") {
    //console.log('Show success')
    this.toastr.success(message, "Success")
  }

  showError(message:string = "") {
    var errorMessage = message? message : "Dear user, we tried processing your request. However, there seems to be a connectivity issue. We advise you try again shortly.";
    this.toastr.error(errorMessage, "Error")
  }

  showInfo(message: string) {
    this.toastr.info(message, "Info")
  }

  showWarning(message: string) {
    this.toastr.warning(message, "Error");
  }

  networkError() {
    this.showWarning("Network Error");
  }
  
  sessionError() {
    this.showError("Your session has expired. please login again to proceed");
  }

  forbiddenError() {
    this.showError("Sorry you are not permitted to perfom this action");
  }

  showMessage(issuccessful: boolean = true, message: string = "Successful") {
    if (issuccessful) {
      this.toastr.success(message, "Success")
    } else {
      this.showWarning(message);
    }
  }

  confirmAction(data: ConfirmationDialogData): Observable<boolean> {
    return this.dialog.open(
      ConfirmationModalComponent, 
      {
        data,
        width: '35%',
        height: 'auto',
        disableClose: true,
      }
    ).afterClosed();
  }

  confirmCheckIn(data: ConfirmationDialogData): Observable<boolean> {
    return this.dialog.open(
      WorkLocationComponent, 
      {
        data,
        width: '60%',
        height: 'auto',
        disableClose: true,
      }
    ).afterClosed();
  }
}
