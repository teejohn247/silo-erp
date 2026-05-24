import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { DynamicField } from '@models/general/dynamic-field';

@Component({
  selector: 'app-salary-scale-info',
  templateUrl: './salary-scale-info.component.html',
  styleUrl: './salary-scale-info.component.scss'
})
export class SalaryScaleInfoComponent implements OnInit {

  form!: FormGroup;
  formFields!: DynamicField[];
  isLoading:boolean = false;
  @Input() editMode!:boolean;
  @Input() payrollCredits:any[] = [];
  @Input() payrollDebits:any[] = [];
  @Output() triggerModalClosure:EventEmitter<any> = new EventEmitter();

  salaryScaleLevelDetails!:FormArray;

  ngOnInit(): void {
      
  }

  closeModal() {
    this.triggerModalClosure.emit('close')
  }
}
