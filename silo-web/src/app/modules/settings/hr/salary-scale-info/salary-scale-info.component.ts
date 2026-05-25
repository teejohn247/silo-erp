import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HrService } from '@services/hr/hr.service';
import { NotificationService } from '@services/utils/notification.service';

@Component({
  selector: 'app-salary-scale-info',
  templateUrl: './salary-scale-info.component.html',
  styleUrl: './salary-scale-info.component.scss'
})
export class SalaryScaleInfoComponent implements OnInit, OnChanges, OnDestroy {

  @Input() editMode = false;
  @Input() payrollCredits: any[] = [];
  @Input() payrollDebits:  any[] = [];
  @Input() salaryScaleInfo$ = new BehaviorSubject<any>(null);
  @Output() triggerModalClosure = new EventEmitter<{ dirty: boolean }>();

  form!: FormGroup;
  isLoading = false;

  salaryScaleLevelDetails!: FormArray;
  activeTab = 0;

  payrollCreditOptions: Record<string, string> = {};
  payrollDebitOptions:  Record<string, string> = {};

  readonly payTypeOptions: Record<string, string> = {
    exact:      'Exact',
    percentage: 'Percentage'
  };

  private readonly destroy$ = new Subject<void>();

  constructor(
    private fb:        FormBuilder,
    private hrService: HrService,
    private notify:    NotificationService
  ) {}

  ngOnInit(): void {
    this.payrollCreditOptions = this.toOptions(this.payrollCredits, 'name');
    this.payrollDebitOptions  = this.toOptions(this.payrollDebits,  'name');

    this.form = this.fb.group({
      name:              [null, Validators.required],
      minAmount:         [0,   Validators.required],
      maxAmount:         [0,   Validators.required],
      description:       [null],
      salaryScaleLevels: this.fb.array([])
    });

    this.salaryScaleLevelDetails = this.form.get('salaryScaleLevels') as FormArray;

    // React to parent pushing a record for editing (or null to reset for creation)
    this.salaryScaleInfo$.pipe(takeUntil(this.destroy$)).subscribe(info => {
      this.resetForm();
      info ? this.populateForm(info) : this.addLevel();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['payrollCredits']?.currentValue?.length) {
      this.payrollCreditOptions = this.toOptions(this.payrollCredits, 'name');
    }
    if (changes['payrollDebits']?.currentValue?.length) {
      this.payrollDebitOptions = this.toOptions(this.payrollDebits, 'name');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ---------------------------------------------------------------------------
  // Form population / reset
  // ---------------------------------------------------------------------------

  private populateForm(info: any): void {
    this.form.patchValue({
      name:        info.name,
      minAmount:   info.minAmount,
      maxAmount:   info.maxAmount,
      description: info.description
    });

    info.salaryScaleLevels?.forEach((level: any, levelIndex: number) => {
      this.addLevel(level);
      level.payrollCredits?.forEach((c: any) => this.addLevelCredit(levelIndex, c));
      level.payrollDebits?.forEach((d: any)  => this.addLevelDebit(levelIndex,  d));
    });
  }

  private resetForm(): void {
    this.form?.reset({ name: null, minAmount: 0, maxAmount: 0, description: null });
    this.salaryScaleLevelDetails?.clear();
    this.activeTab = 0;
  }

  // ---------------------------------------------------------------------------
  // Level management
  // ---------------------------------------------------------------------------

  addLevel(levelInfo?: any): void {
    this.salaryScaleLevelDetails.push(this.fb.group({
      levelName:      [levelInfo?.levelName ?? `Level ${this.salaryScaleLevelDetails.length + 1}`, Validators.required],
      payrollCredits: this.fb.array([]),
      payrollDebits:  this.fb.array([])
    }));
    this.activeTab = this.salaryScaleLevelDetails.length - 1;
  }

  removeLevel(index: number): void {
    this.salaryScaleLevelDetails.removeAt(index);
    if (this.activeTab >= this.salaryScaleLevelDetails.length) {
      this.activeTab = this.salaryScaleLevelDetails.length - 1;
    }
  }

  toggleLevel(index: number): void {
    this.activeTab = this.activeTab === index ? -1 : index;
  }

  // ---------------------------------------------------------------------------
  // Credit management
  // ---------------------------------------------------------------------------

  levelCredits(levelIndex: number): FormArray {
    return this.salaryScaleLevelDetails.at(levelIndex).get('payrollCredits') as FormArray;
  }

  addLevelCredit(levelIndex: number, creditInfo?: any): void {
    this.levelCredits(levelIndex).push(this.fb.group({
      name:  [creditInfo?.creditId ?? '', Validators.required],
      type:  [creditInfo?.type     ?? '', Validators.required],
      value: [creditInfo?.value    ?? 0],
      ref:   [creditInfo?.ref      ?? '']
    }));
  }

  removeLevelCredit(levelIndex: number, creditIndex: number): void {
    this.levelCredits(levelIndex).removeAt(creditIndex);
  }

  // ---------------------------------------------------------------------------
  // Debit management
  // ---------------------------------------------------------------------------

  levelDebits(levelIndex: number): FormArray {
    return this.salaryScaleLevelDetails.at(levelIndex).get('payrollDebits') as FormArray;
  }

  addLevelDebit(levelIndex: number, debitInfo?: any): void {
    this.levelDebits(levelIndex).push(this.fb.group({
      name:  [debitInfo?.debitId ?? '', Validators.required],
      type:  [debitInfo?.type    ?? '', Validators.required],
      value: [debitInfo?.value   ?? 0],
      ref:   [debitInfo?.ref     ?? '']
    }));
  }

  removeLevelDebit(levelIndex: number, debitIndex: number): void {
    this.levelDebits(levelIndex).removeAt(debitIndex);
  }

  // ---------------------------------------------------------------------------
  // Pay type helpers
  // ---------------------------------------------------------------------------

  payValueLimit(levelIndex: number, itemIndex: number, payrollType: 'credit' | 'debit'): number {
    const ctrl = payrollType === 'credit'
      ? this.levelCredits(levelIndex).at(itemIndex)
      : this.levelDebits(levelIndex).at(itemIndex);
    return ctrl.get('type')?.value === 'percentage' ? 100 : 1_000_000_000;
  }

  payValueRef(levelIndex: number, itemIndex: number, payrollType: 'credit' | 'debit'): boolean {
    const ctrl = payrollType === 'credit'
      ? this.levelCredits(levelIndex).at(itemIndex)
      : this.levelDebits(levelIndex).at(itemIndex);
    return ctrl.get('type')?.value === 'percentage';
  }

  // ---------------------------------------------------------------------------
  // Submit / close
  // ---------------------------------------------------------------------------

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isLoading = true;
    const payload = this.form.value;
    const id      = this.salaryScaleInfo$.getValue()?._id;

    const request$ = this.editMode
      ? this.hrService.updateSalaryScale(id, payload)
      : this.hrService.createSalaryScale(payload);

    request$.subscribe({
      next: res => {
        if (res.success) {
          this.notify.showSuccess(
            this.editMode ? 'Salary scale updated successfully' : 'Salary scale created successfully'
          );
          this.triggerModalClosure.emit({ dirty: true });
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  closeModal(): void {
    this.triggerModalClosure.emit({ dirty: false });
  }

  // ---------------------------------------------------------------------------
  // Utilities
  // ---------------------------------------------------------------------------

  private toOptions(arr: any[], labelKey: string): Record<string, string> {
    return arr.reduce((acc, item) => {
      acc[item._id] = item[labelKey];
      return acc;
    }, {} as Record<string, string>);
  }
}
