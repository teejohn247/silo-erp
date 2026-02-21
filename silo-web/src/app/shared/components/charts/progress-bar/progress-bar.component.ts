import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss'
})
export class ProgressBarComponent implements OnInit {

  // Input percentage (0–100)
  @Input() value: number = 0;

  // Input status (determines color)
  @Input() status: 'complete' | 'pending' | 'warning' | 'error' = 'pending';

  // Calculated style for width
  barWidth: number = 0;
  barHeight: string = '0.8rem';

  // Calculated color
  barColor: string = '#FFC107';

  ngOnInit(): void {
    setTimeout(() => {
      this.updateBar();
    }, 1000)
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   this.updateBar();
  // }

  private updateBar() {
    // Animate width
    this.barWidth = this.value;

    // Set color based on status
    switch (this.status) {
      case 'complete':
        this.barColor = '#4CAF50';
        break;
      case 'pending':
        this.barColor = 'rgba(229, 166, 71, 0.8)';
        break;
      case 'warning':
        this.barColor = '#FF9800';
        break;
      case 'error':
        this.barColor = '#F44336';
        break;
      default:
        this.barColor = '#2196F3';
    }
  }

}
