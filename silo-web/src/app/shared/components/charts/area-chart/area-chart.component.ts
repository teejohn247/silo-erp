import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-area-chart',
  templateUrl: './area-chart.component.html',
  styleUrl: './area-chart.component.scss'
})
export class AreaChartComponent implements OnInit {
  AreaHighcharts: typeof Highcharts = Highcharts;

  // 👇 Make chart options reusable with Input
  @Input() chartTitle: string = '';
  @Input() chartDataYAxis: number[] = [7.9, 10.2, 13.7, 16.5, 17.9, 15.2, 17.0, 20.6, 22.2, 26.3, 29.6, 27.8]
  @Input() chartDataXAxis: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  @Input() height: string = '250px';

  chartOptions: Highcharts.Options = {};

  ngOnInit(): void {
    this.chartOptions = {
      chart: {
        type: 'area'
      },
      credits: {
        enabled: false
      },
      title: {
        text: this.chartTitle
      },
      xAxis:{
        categories: this.chartDataXAxis,
        labels: {
          enabled: true
        }
      },
      yAxis: {          
        title:{
          text:""
        },
        labels: {
          enabled: true,
          formatter: function () {
            return '₦' + this.axis.defaultLabelFormatter.call(this) + 'K';
          }            
        }
      },
      colors: ['#4db1ff'],
      series: [
        {
          type: 'areaspline',
          name: 'Revenue',
          showInLegend: false,
          data: this.chartDataYAxis,
          fillColor: {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
            stops: [
              [0, '#4db1ff'],
              [1, Highcharts.color('#4db1ff').setOpacity(0).get('rgba') as string],
            ],
          },
        },
      ],
    };
  }
}
