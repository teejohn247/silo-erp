import { CommonModule, NgComponentOutlet } from '@angular/common';
import { Component, ComponentRef, Inject, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-global-modal',
  templateUrl: './global-modal.component.html',
  styleUrls: ['./global-modal.component.scss'],   
  imports: [ CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule, NgComponentOutlet],
  standalone: true
})
export class GlobalModalComponent implements OnInit {
  @ViewChild('container', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;
  
  private componentRef!: ComponentRef<any>;

  constructor(
    private dialogRef: MatDialogRef<GlobalModalComponent>,
    @Inject(MAT_DIALOG_DATA) public modalData: any
  ) {}

  ngOnInit(): void {
    // Dynamically create the UI component
    this.componentRef = this.container.createComponent(this.modalData.component);

    // Pass data to the UI component
    if (this.modalData.data) {
      Object.assign(this.componentRef.instance, { data: this.modalData.data });
    }

    // Subscribe to submit event if it exists
    if (this.componentRef.instance.submit) {
      this.componentRef.instance.submit.subscribe((output: any) => {
        this.modalData.onSubmit(output);
        this.dialogRef.close();
      });
    }
  }

  close(result?: any) {
    this.dialogRef.close(result);
  }
}
