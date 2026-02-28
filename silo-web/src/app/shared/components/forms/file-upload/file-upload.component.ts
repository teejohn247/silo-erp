import {
  Component,
  Input,
  forwardRef,
  ViewChild,
  ElementRef
} from '@angular/core';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploadComponent),
      multi: true
    }
  ]
})
export class FileUploadComponent implements ControlValueAccessor {

  @Input() mode: 'file' | 'profile' = 'file';
  @Input() defaultImage: string | null = null;
  @Input() displayOnly: boolean = false;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  selectedFile: File | null = null;
  fileName: string = '';
  previewUrl: string | null = null;

  disabled = false;

  // ===== ControlValueAccessor =====

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {

    if (value instanceof File) {
      this.selectedFile = value;
      this.fileName = value.name;

      if (this.mode === 'profile') {
        this.previewUrl = URL.createObjectURL(value);
      }

    } else if (typeof value === 'string') {
      // Existing image URL
      this.previewUrl = value;
      this.fileName = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // ===== Internal Logic =====

  triggerFileInput() {
    if (!this.disabled) {
      this.fileInput.nativeElement.click();
    }
  }

  handleFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;
    this.fileName = file.name;

    if (this.mode === 'profile') {
      this.previewUrl = URL.createObjectURL(file);
    }

    this.onChange(file);
    this.onTouched();
  }
}
