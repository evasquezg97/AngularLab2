import { Injectable } from '@angular/core';
import { DailyData, MonthlyData } from '../models/data.model';
import { Autocomplete } from '../models/autocomplete.model';



@Injectable({
  providedIn: 'root'
})
export class InitService {

  constructor() { }



  dailyDataInit: DailyData = {
    "Meta Data": {
      "1. Information": "Daily Prices (open, high, low, close) and Volumes",
      "2. Symbol": "IBM",
      "3. Last Refreshed": "2023-12-01",
      "4. Output Size": "Compact",
      "5. Time Zone": "US/Eastern"
    },
    "Time Series (Daily)": {
      "2023-12-01": {
        "1. open": "158.4100",
        "2. high": "160.5900",
        "3. low": "158.0000",
        "4. close": "160.5500",
        "5. volume": "4871860"
      }
    }
  };

  monthlyDataInit: MonthlyData = {
    "Meta Data": {
      "1. Information": "Monthly Prices (open, high, low, close) and Volumes",
      "2. Symbol": "IBM",
      "3. Last Refreshed": "2023-12-01",
      "4. Time Zone": "US/Eastern"
    },
    "Monthly Time Series": {
      "2023-12-01": {
        "1. open": "158.4100",
        "2. high": "160.5900",
        "3. low": "158.0000",
        "4. close": "160.5500",
        "5. volume": "4871860"
      }
    }
  };

  autoComplete: Autocomplete = {
    "bestMatches": [
      {
        "1. symbol": "TSCO.LON",
        "2. name": "Tesco PLC",
        "3. type": "Equity",
        "4. region": "United Kingdom",
        "5. marketOpen": "08:00",
        "6. marketClose": "16:30",
        "7. timezone": "UTC+01",
        "8. currency": "GBX",
        "9. matchScore": "0.7273"
      }
    ]
  };

}
