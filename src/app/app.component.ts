import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TypeheadComponent } from "./components/typehead/typehead.component";
import { ChartComponent } from "./components/chart/chart.component";
import { TogglesComponent } from "./components/toggles/toggles.component";
import { RequestService } from './services/request.service';
import { RequestType } from './models/request.model';
import { Autocomplete } from './models/autocomplete.model';
import { ChartData } from './models/data.model';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [CommonModule, RouterOutlet,
    TypeheadComponent,
    ChartComponent,
    TogglesComponent,
  ]
})
export class AppComponent implements OnInit {
  title = 'AvanzatechFinancialKW';

  private requestService = inject(RequestService);
  private toastrService = inject(ToastrService);

  processedAutocompleteData: any = [];
  processedDailyData: any = [];
  processedMonthlyData: any = [];
  symbol: string = "";
  dataChart!: ChartData[];
  toggleMode: string = "daily";

  saveState() {
    sessionStorage.setItem("symbol", this.symbol);
    sessionStorage.setItem("toggleMode", this.toggleMode);
    sessionStorage.setItem("processedDailyData", JSON.stringify(this.processedDailyData));
    sessionStorage.setItem("processedMonthlyData", JSON.stringify(this.processedMonthlyData));
  }

  ngOnInit(): void {
    if (sessionStorage.length) {
      this.symbol = sessionStorage.getItem("symbol") as string;
      this.toggleMode = sessionStorage.getItem("toggleMode") as string;
      this.processedDailyData = JSON.parse(sessionStorage.getItem("processedDailyData") as string);
      this.processedMonthlyData = JSON.parse(sessionStorage.getItem("processedMonthlyData") as string);
      if (this.toggleMode === "daily") {
        this.dataChart = this.processedDailyData;
      } else if (this.toggleMode === "monthly") {
        this.dataChart = this.processedMonthlyData;
      }
    }

  }

  processAutocompleteData(data: Autocomplete) {
    this.processedAutocompleteData.length = 0;
    if (data["bestMatches"].length === 0) {
      this.toastrService.warning("Please make a new search", "No suggestion found", { positionClass: 'toast-top-center' });
    } else {
      for (let option in data["bestMatches"]) {
        this.processedAutocompleteData.push([data["bestMatches"][option]["1. symbol"], data["bestMatches"][option]["2. name"]]);
      }
    }
  }

  processChartData(type: RequestType, data: any) {
    if (type === "daily") {
      let firstDay: Date | string | null = null;
      let result = [];
      for (let day in data['Time Series (Daily)']) {
        if (!firstDay) {
          firstDay = new Date(day);
          firstDay.setMonth(firstDay.getMonth() - 1);
          firstDay = firstDay.toISOString().substring(0, 10);
        }

        if (day >= firstDay) {
          result.unshift({
            name: day,
            value: data['Time Series (Daily)'][day]['4. close'],
          });
        }
      }

      result = [
        {
          name: data["Meta Data"]["2. Symbol"],
          series: result,
        },
      ];

      this.processedDailyData = result;
      this.dataChart = result;

    } else if (type === "monthly") {
      let firstMonth: Date | string | null = null;
      let result = [];
      for (let month in data['Monthly Time Series']) {
        if (!firstMonth) {
          firstMonth = new Date(month);
          firstMonth.setFullYear(firstMonth.getFullYear() - 1);
          firstMonth = firstMonth.toISOString().substring(0, 7);
        }

        let monthName = month.substring(0, 7);

        if (monthName >= firstMonth) {
          result.unshift({
            name: monthName,
            value: data['Monthly Time Series'][month]['4. close'],
          });
        }
      }

      result = [
        {
          name: data['Meta Data']['2. Symbol'],
          series: result,
        },
      ];

      this.processedMonthlyData = result;
      this.dataChart = result;
    }
  }

  onTypeheadListener(event: [RequestType, string]) {
    if (event[1] !== this.symbol && (event[0] === "daily" || event[0] === "monthly")) {
      this.processedDailyData.length = 0;
      this.processedMonthlyData.length = 0;
      sessionStorage.clear();
    }

    this.requestService.getData(event[0], event[1]).subscribe({
      next: (data: any) => {
        switch (event[0]) {
          case "autocomplete":
            if (data.hasOwnProperty("bestMatches")) {
              this.processAutocompleteData(data);
            } else {
              this.toastrService.error("You've reached the 25 query limit or you are using the API key 'demo'", "API Error",
                { positionClass: 'toast-top-center', tapToDismiss: true, timeOut: 2000, progressBar: true, progressAnimation: 'increasing' });
            }
            break;
          case "daily":
            if (data.hasOwnProperty("Time Series (Daily)")) {
              this.symbol = event[1];
              this.processChartData("daily", data);
            } else {
              this.toastrService.error("You've reached the 25 query limit or you are using the API key 'demo'", "API Error",
                { positionClass: 'toast-top-center', tapToDismiss: true, timeOut: 2000, progressBar: true, progressAnimation: 'increasing' });
            }
            this.saveState();
            break;
          case "monthly":
            if (data.hasOwnProperty("Monthly Time Series")) {
              this.symbol = event[1];
              this.processChartData("monthly", data);
            } else {
              this.toastrService.error("You've reached the 25 query limit or you are using the API key 'demo'", "API Error",
                { positionClass: 'toast-top-center', tapToDismiss: true, timeOut: 2000, progressBar: true, progressAnimation: 'increasing' });
            }
            this.saveState();
            break;
        }
      },
      error: (error: any) => {
        console.error('There was an error!', error);
      }
    });
  }

  onTogglesListener(event: string) {
    if (this.symbol) {
      this.toggleMode = event;
      sessionStorage.setItem("toggleMode", this.toggleMode);
      if (this.toggleMode === "daily") {
        if (this.processedDailyData.length !== 0) {
          this.dataChart = this.processedDailyData;
        } else {
          this.onTypeheadListener(["daily", this.symbol]);
        }
      } else if (this.toggleMode === "monthly") {
        if (this.processedMonthlyData.length !== 0) {
          this.dataChart = this.processedMonthlyData;
        } else {
          this.onTypeheadListener(["monthly", this.symbol]);
        }
      }
    }
  }
}
