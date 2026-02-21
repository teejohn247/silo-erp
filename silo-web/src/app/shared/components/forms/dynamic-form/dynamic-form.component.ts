import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DynamicField, DynamicFormAction, DynamicFormButton } from '@models/general/dynamic-field';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss'
})
export class DynamicFormComponent implements OnInit {

  @Input() form!: FormGroup;
  @Input() fields: DynamicField[] = [];
  @Input() buttonSaveLabel:string = 'Save';
  @Input() isLoading: boolean = false;
  @Input() loadingButtonKey: string | null = null;
  @Input() buttons: DynamicFormButton[] | null = null;
  @Output() formAction = new EventEmitter<DynamicFormAction>();

  keepOrder = () => 0;

  // Keep track of uploaded files and names
  // files: Record<string, File> = {};
  // fileNames: Record<string, string> = {};

  // Map of controlName -> HTMLInputElement
  // fileInputs: Record<string, HTMLInputElement> = {};

  constructor(private fb: FormBuilder) {}
  
  ngOnInit(): void {

    this.fields.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    this.form = this.fb.group({});
    this.fields.forEach(field => {
      this.form.addControl(
        field.controlName,
        this.fb.control(field.initialValue, field.validators || [])
      );
    });
  }

  // submitForm() {
  //   if (this.form.valid) {
  //     this.formSubmit.emit(this.form.value);
  //   } 
  //   else {
  //     this.form.markAllAsTouched();
  //   }
  // }

  triggerAction(buttonKey: string) {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.formAction.emit({
      buttonKey,
      value: this.form.value
    });
  }


  // Multiple select remove handler (like removeTicket)
  removeMultiSelectValue(fieldName: string, value: any) {
    const selectedValues = this.form.get(fieldName)?.value as any[];
    this.removeFirst(selectedValues, value);
    this.form.get(fieldName)?.setValue(selectedValues); // trigger change detection
  }

  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  // registerFileInput(fieldName: string, input: HTMLInputElement) {
  //   this.fileInputs[fieldName] = input;
  // }

  // // File upload handler
  // handleFileChange(event: any, fieldName: string) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.files[fieldName] = file;
  //     this.fileNames[fieldName] = file.name;
  //     this.form.get(fieldName)?.setValue(file); // Update FormControl
  //   }
  // }

  // triggerFileInput(fieldName: string) {
  //   this.fileInputs[fieldName]?.click();
  // }
}
