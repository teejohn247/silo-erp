import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HrService } from '@services/hr/hr.service';
import { NotificationService } from '@services/utils/notification.service';

@Component({
  selector: 'app-recruitment-forms',
  templateUrl: './recruitment-forms.component.html',
  styleUrl: './recruitment-forms.component.scss'
})
export class RecruitmentFormsComponent implements OnInit {

  forms: any[] = [];
  isLoading = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private hrService: HrService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.getForms();
  }

  getForms() {
    this.isLoading = true;
    this.hrService.getJobForms().subscribe({
      next: res => {
        this.forms = res.data ?? [];
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  openNewForm() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  editForm(form: any) {
    this.router.navigate([form._id], { relativeTo: this.route });
  }

  copyLink(form: any) {
    const link = `${window.location.origin}/apply/${form._id}`;
    navigator.clipboard.writeText(link).then(() => {
      this.notify.showSuccess('Application link copied to clipboard');
    });
  }

  deleteForm(form: any) {
    this.notify.confirmAction({
      title: 'Delete Form',
      message: `Are you sure you want to delete "${form.formName}"?`,
      confirmText: 'Delete Form',
      cancelText: 'Cancel',
    }).subscribe(confirmed => {
      if (!confirmed) return;
      this.hrService.deleteJobForm(form._id).subscribe({
        next: res => {
          if (res.success) this.notify.showSuccess('Form deleted successfully');
          this.getForms();
        }
      });
    });
  }
}
