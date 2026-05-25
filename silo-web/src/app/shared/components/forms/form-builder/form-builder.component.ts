import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Validators } from '@angular/forms';
import { DynamicField } from '@models/general/dynamic-field';

export interface BuilderField {
  id: string;
  controlType: DynamicField['controlType'];
  controlLabel: string;
  controlName: string;
  controlWidth: '100%' | '48%';
  required: boolean;
  selectOptions: { key: string; value: string }[];
}

interface FieldTypeDef {
  type: DynamicField['controlType'];
  biIcon: string;
  label: string;
}

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrl: './form-builder.component.scss'
})
export class FormBuilderComponent implements OnInit {

  @Input() set initialFields(fields: DynamicField[]) {
    if (!fields?.length) return;
    this.fields = fields.map(f => ({
      id: this.genId(),
      controlType: f.controlType,
      controlLabel: f.controlLabel,
      controlName: f.controlName,
      controlWidth: (f.controlWidth as '100%' | '48%') || '100%',
      required: !!(f.validators?.length),
      selectOptions: f.selectOptions
        ? Object.entries(f.selectOptions).map(([key, value]) => ({ key, value }))
        : []
    }));
  }

  @Output() fieldsChange = new EventEmitter<DynamicField[]>();

  fields: BuilderField[] = [];

  readonly fieldTypes: FieldTypeDef[] = [
    { type: 'text',          biIcon: 'bi-cursor-text',      label: 'Text'        },
    { type: 'textarea',      biIcon: 'bi-paragraph',        label: 'Text Area'   },
    { type: 'number',        biIcon: 'bi-123',              label: 'Number'      },
    { type: 'select',        biIcon: 'bi-menu-button',      label: 'Dropdown'    },
    { type: 'mutipleSelect', biIcon: 'bi-ui-checks-grid',   label: 'Multi-Select'},
    { type: 'date',          biIcon: 'bi-calendar3',        label: 'Date'        },
    { type: 'time',          biIcon: 'bi-clock',            label: 'Time'        },
    { type: 'file',          biIcon: 'bi-paperclip',        label: 'File Upload' },
  ];

  private readonly typeLabels: Record<DynamicField['controlType'], string> = {
    text:          'Text',
    textarea:      'Text Area',
    number:        'Number',
    select:        'Dropdown',
    mutipleSelect: 'Multi-Select',
    date:          'Date',
    time:          'Time',
    file:          'File Upload',
    quillEditor:   'Rich Text',
    rangeSlider:   'Range Slider'
  };

  ngOnInit(): void {}

  // ─── Field management ─────────────────────────────────────────

  addField(controlType: DynamicField['controlType']): void {
    const baseLabel = this.typeLabels[controlType];
    const existing  = this.fields.filter(f => f.controlType === controlType).length;
    const label     = existing > 0 ? `${baseLabel} ${existing + 1}` : baseLabel;

    this.fields.push({
      id:            this.genId(),
      controlType,
      controlLabel:  label,
      controlName:   this.toControlName(label),
      controlWidth:  '100%',
      required:      false,
      selectOptions: []
    });
    this.emit();
  }

  removeField(index: number): void {
    this.fields.splice(index, 1);
    this.emit();
  }

  onDrop(event: CdkDragDrop<BuilderField[]>): void {
    moveItemInArray(this.fields, event.previousIndex, event.currentIndex);
    this.emit();
  }

  // ─── Field config ─────────────────────────────────────────────

  onLabelChange(field: BuilderField): void {
    field.controlName = this.toControlName(field.controlLabel);
    this.emit();
  }

  setWidth(field: BuilderField, width: '100%' | '48%'): void {
    field.controlWidth = width;
    this.emit();
  }

  // ─── Select options ───────────────────────────────────────────

  addOption(field: BuilderField): void {
    field.selectOptions.push({ key: '', value: '' });
  }

  onOptionValueChange(opt: { key: string; value: string }): void {
    if (!opt.key) {
      opt.key = this.toControlName(opt.value);
    }
  }

  removeOption(field: BuilderField, index: number): void {
    field.selectOptions.splice(index, 1);
    this.emit();
  }

  // ─── Helpers ──────────────────────────────────────────────────

  isSelectType(controlType: DynamicField['controlType']): boolean {
    return controlType === 'select' || controlType === 'mutipleSelect';
  }

  getTypeLabel(controlType: DynamicField['controlType']): string {
    return this.typeLabels[controlType] ?? controlType;
  }

  emit(): void {
    const output: DynamicField[] = this.fields.map((f, i) => {
      const field: DynamicField = {
        controlName:  f.controlName || this.toControlName(f.controlLabel),
        controlType:  f.controlType,
        controlLabel: f.controlLabel,
        controlWidth: f.controlWidth,
        order:        i + 1,
        validators:   f.required ? [Validators.required] : []
      };
      if (this.isSelectType(f.controlType) && f.selectOptions.length) {
        field.selectOptions = f.selectOptions.reduce((acc, o) => {
          if (o.key) acc[o.key] = o.value;
          return acc;
        }, {} as Record<string, string>);
      }
      return field;
    });
    this.fieldsChange.emit(output);
  }

  private toControlName(label: string): string {
    const words = label.trim().split(/\s+/);
    return words
      .map((w, i) => i === 0
        ? w.toLowerCase()
        : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join('')
      .replace(/[^a-zA-Z0-9]/g, '');
  }

  private genId(): string {
    return Math.random().toString(36).slice(2, 9);
  }
}
