import { Component, Input } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartData } from '../../models/data.model';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css'
})
export class ChartComponent {
  view: [number, number] = [window.innerWidth > 1000 ? 700 : window.innerWidth, 300];

  @Input() multi!: ChartData[];
  @Input() xAxisLabel!: string;

  // options
  legend: boolean = false;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'Stock Price [USD]';
  timeline: boolean = true;
  colorScheme = "cool"


  onResize(event: any) {
    if (event.target.innerWidth < 1000) {
      this.view = [event.target.innerWidth / 1.5, 300];
    }
  }

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
