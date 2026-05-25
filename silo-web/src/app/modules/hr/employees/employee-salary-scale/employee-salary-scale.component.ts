import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HrService } from '@services/hr/hr.service';
import { NotificationService } from '@services/utils/notification.service';

@Component({
  selector: 'app-employee-salary-scale',
  templateUrl: './employee-salary-scale.component.html',
  styleUrl: './employee-salary-scale.component.scss'
})
export class EmployeeSalaryScaleComponent implements OnInit, OnDestroy {

  @Input() data!: any;

  form!: FormGroup;
  salaryScaleOptions: Record<string, string> = {};
  scaleLevelOptions: Record<string, string> = {};
  isLoading = false;

  private salaryScales: any[] = [];
  private readonly destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private hrService: HrService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.salaryScales = this.data.salaryScales ?? [];
    this.salaryScaleOptions = this.toOptions(this.salaryScales, 'name');

    this.form = this.fb.group({
      salaryScale: [null, Validators.required],
      scaleLevel:  [null, Validators.required]
    });

    // When a scale is chosen, populate its levels and auto-select if only one
    this.form.get('salaryScale')!.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(scaleId => {
        const selected = this.salaryScales.find(s => s._id === scaleId);
        if (!selected) return;

        const levels: any[] = selected.salaryScaleLevels ?? [];
        this.scaleLevelOptions = this.toOptions(levels, 'levelName');
        this.form.get('scaleLevel')!.setValue(
          levels.length === 1 ? levels[0]._id : null
        );
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isLoading = true;
    const payload = {
      employeeIds:   this.data.selectedEmployees.map((e: any) => e._id),
      salaryScaleId: this.form.value.salaryScale,
      salaryLevelId: this.form.value.scaleLevel
    };

    this.hrService.assignSalaryScale(payload).subscribe({
      next: res => {
        if (res.status === 200) {
          this.notify.showSuccess('Salary scale assigned successfully');
          this.data.onSubmit({ dirty: true });
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  private toOptions(arr: any[], labelKey: string): Record<string, string> {
    return arr.reduce((acc, item) => {
      acc[item._id] = item[labelKey];
      return acc;
    }, {} as Record<string, string>);
  }
}
