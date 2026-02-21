import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pie-chart',
  standalone: false,
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss'
})
export class PieChartComponent implements OnInit {
  @Input() chartSize:any = [280, 280];
  @Input() doughnut:boolean = false;
  @Input() colorScheme:any = {
    domain: ['rgba(54, 171, 104, 0.7)', 'rgba(229, 166, 71, 0.7)', 'rgba(66, 133, 244, 0.7)', 'rgba(235, 87, 87, 0.7)']
  };
  @Input() chartData!:any;

  ngOnInit(): void {
      
  }

}
