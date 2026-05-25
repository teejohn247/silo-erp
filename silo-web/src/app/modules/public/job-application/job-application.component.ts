import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DynamicField } from '@models/general/dynamic-field';
import { HrService } from '@services/hr/hr.service';
import { NotificationService } from '@services/utils/notification.service';
import { SharedModule } from '@sharedWeb/shared.module';

@Component({
  selector: 'app-job-application',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './job-application.component.html',
  styleUrl: './job-application.component.scss'
})
export class JobApplicationComponent implements OnInit {

  formData: any;
  fields: DynamicField[] = [];
  isLoading = true;
  isSubmitting = false;
  submitted = false;
  notFound = false;

  constructor(
    private route: ActivatedRoute,
    private hrService: HrService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    const formId = this.route.snapshot.params['formId'];
    this.hrService.getPublicJobForm(formId).subscribe({
      next: res => {
        this.formData = res.data;
        this.fields = res.data?.fields ?? [];
        this.isLoading = false;
      },
      error: () => {
        this.notFound = true;
        this.isLoading = false;
      }
    });
  }

  handleSubmit(event: any) {
    const formId = this.route.snapshot.params['formId'];
    this.isSubmitting = true;
    this.hrService.submitJobFormResponse(formId, event.value).subscribe({
      next: res => {
        this.isSubmitting = false;
        if (res.success) this.submitted = true;
      },
      error: () => { this.isSubmitting = false; }
    });
  }
}
