import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicField } from '@models/general/dynamic-field';
import { HrService } from '@services/hr/hr.service';
import { NotificationService } from '@services/utils/notification.service';
import { UtilityService } from '@services/utils/utility.service';

@Component({
  selector: 'app-recruitment-form-info',
  templateUrl: './recruitment-form-info.component.html',
  styleUrl: './recruitment-form-info.component.scss'
})
export class RecruitmentFormInfoComponent implements OnInit {

  metaForm!: FormGroup;
  formFields: DynamicField[] = [];
  jobPosts: any[] = [];
  isLoading = false;
  isSaved = false;

  formId!: string;
  formInView: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private hrService: HrService,
    private utils: UtilityService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.formId = this.route.snapshot.params['id'];

    this.metaForm = this.fb.group({
      formName: ['', Validators.required],
      description: [''],
      jobPost: ['']
    });

    this.hrService.getJobRoles().subscribe(res => {
      this.jobPosts = res.data ?? [];
    });

    if (this.formId && this.formId !== 'new') {
      this.hrService.getJobFormById(this.formId).subscribe(res => {
        this.formInView = res.data;
        this.metaForm.patchValue({
          formName: this.formInView.formName,
          description: this.formInView.description,
          jobPost: this.formInView.jobPost
        });
        this.formFields = this.formInView.fields ?? [];
      });
    }
  }

  goBack() {
    this.utils.goBack();
  }

  onFieldsChange(fields: DynamicField[]) {
    this.formFields = fields;
    this.isSaved = false;
  }

  save() {
    if (this.metaForm.invalid) {
      this.metaForm.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.metaForm.value,
      fields: this.formFields
    };

    this.isLoading = true;

    const request$ = this.formInView
      ? this.hrService.updateJobForm(this.formInView._id, payload)
      : this.hrService.createJobForm(payload);

    request$.subscribe({
      next: res => {
        this.isLoading = false;
        this.isSaved = true;
        if (res.success) {
          this.notify.showSuccess(this.formInView ? 'Form updated successfully' : 'Form created successfully');
          if (!this.formInView && res.data?._id) {
            this.formInView = res.data;
            this.router.navigate(['..', res.data._id], { relativeTo: this.route });
          }
        }
      },
      error: () => { this.isLoading = false; }
    });
  }

  copyLink() {
    if (!this.formInView?._id) return;
    const link = `${window.location.origin}/apply/${this.formInView._id}`;
    navigator.clipboard.writeText(link).then(() => {
      this.notify.showSuccess('Application link copied to clipboard');
    });
  }
}
