import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RequestService } from './services/request.service';
import { RequestType } from './models/request.model';
import { of } from 'rxjs';
import { InitService } from './services/init.service';
import { provideToastr, ToastrService } from 'ngx-toastr';

describe('AppComponent', () => {
  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let initService: InitService;
  let requestService: RequestService;
  let toastrService: ToastrService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, AppComponent, HttpClientTestingModule],
      providers: [InitService, RequestService, ToastrService, provideToastr()]
    }).compileComponents();

    initService = TestBed.inject(InitService);
    requestService = TestBed.inject(RequestService);
    toastrService = TestBed.inject(ToastrService);
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it(`should have the 'AvanzatechFinancialKW' title`, () => {
    expect(app.title).toEqual('AvanzatechFinancialKW');
  });

  it('should render title', () => {
    const debugElement: DebugElement = fixture.debugElement;
    const h1Debug: DebugElement = debugElement.query(By.css('h1'));
    const compiled: HTMLElement = h1Debug.nativeElement;
    expect(compiled.textContent).toContain('Avanzatech Financial');
  });

  it("should call the requestService.getData method", () => {
    const requestServiceSpy = jasmine.createSpyObj("requestService", ["getData"]);
    requestServiceSpy.getData.and.returnValue("fake data");
    expect(requestServiceSpy.getData("daily", "IBM")).toEqual("fake data");
    expect(requestServiceSpy.getData).toHaveBeenCalled();
  });

  it('should call processAutocompleteData when autocomplete data is received', () => {
    const mockData = initService.autoComplete;
    const mockEvent: [RequestType, string] = ['autocomplete', 'mockSymbol'];

    spyOn(requestService, 'getData').and.returnValue(of(mockData));
    spyOn(app, 'processAutocompleteData');

    app.onTypeheadListener(mockEvent);

    expect(app.processAutocompleteData).toHaveBeenCalledWith(mockData);
  });

  it('should call processChartData when daily data is received', () => {
    const mockData = initService.dailyDataInit;
    const mockEvent: [RequestType, string] = ['daily', 'mockSymbol'];

    spyOn(requestService, 'getData').and.returnValue(of(mockData));
    spyOn(app, 'processChartData');

    app.onTypeheadListener(mockEvent);

    expect(app.processChartData).toHaveBeenCalledWith('daily', mockData);
  });

  it('should call processChartData when monthly data is received', () => {
    const mockData = initService.monthlyDataInit;
    const mockEvent: [RequestType, string] = ['monthly', 'mockSymbol'];

    spyOn(requestService, 'getData').and.returnValue(of(mockData));
    spyOn(app, 'processChartData');

    app.onTypeheadListener(mockEvent);

    expect(app.processChartData).toHaveBeenCalledWith('monthly', mockData);
  });

  describe('Tests for onToggleListener', () => {
    it('should set toggle mode to daily', () => {
      app.symbol = 'mockSymbol';
      const mockEvent: string = 'daily';
      app.onTogglesListener(mockEvent);
      expect(app.toggleMode).toEqual('daily');
    });

    it('should set toggle mode to monthly', () => {
      app.symbol = 'mockSymbol';
      const mockEvent: string = 'monthly';
      app.onTogglesListener(mockEvent);
      expect(app.toggleMode).toEqual('monthly');
    });

    it('should call onTypeheadListener when toggleMode is daily and processedDailyData is empty', () => {
      const mockEvent: RequestType = 'daily';
      app.symbol = 'mockSymbol';
      app.processedDailyData = [];
      spyOn(app, 'onTypeheadListener');
      app.onTogglesListener(mockEvent);
      expect(app.onTypeheadListener).toHaveBeenCalledWith([mockEvent, app.symbol]);
    });

    it('should call onTypeheadListener when toggleMode is monthly and processedMonthlyData is empty', () => {
      const mockEvent: string = 'monthly';
      app.symbol = 'mockSymbol';
      app.processedMonthlyData = [];
      spyOn(app, 'onTypeheadListener');
      app.onTogglesListener(mockEvent);
      expect(app.onTypeheadListener).toHaveBeenCalledWith(['monthly', app.symbol]);
    });

    it('should set dataChart to processedDailyData when toggleMode is daily and processedDailyData is not empty', () => {
      const mockDailyData = [{
        name: "mockName",
        series: [{
          name: "mockName",
          value: "1"
        }]
      }];
      app.symbol = 'mockSymbol';
      const mockEvent: string = 'daily';
      spyOn(app, 'onTypeheadListener');
      app.onTogglesListener(mockEvent);
      app.processedDailyData = mockDailyData;
      app.onTogglesListener(mockEvent);
      expect(app.dataChart).toEqual(mockDailyData);
    });

    it('should set dataChart to processedMonthlyData when toggleMode is monthly and processedMonthlyData is not empty', () => {
      const mockMonthlyData = [{
        name: "mockName",
        series: [{
          name: "mockName",
          value: "1"
        }]
      }];
      app.symbol = 'mockSymbol';
      const mockEvent: string = 'monthly';
      spyOn(app, 'processChartData');
      app.onTogglesListener(mockEvent);
      app.processedMonthlyData = mockMonthlyData;
      app.onTogglesListener(mockEvent);
      expect(app.dataChart).toEqual(mockMonthlyData);
    });
  });

  it('should process autocomplete data', () => {
    const mockData = initService.autoComplete;
    const mockProcessedData = [["TSCO.LON", "Tesco PLC"]];
    app.processAutocompleteData(mockData);
    expect(app.processedAutocompleteData).toEqual(mockProcessedData);
  });

  it('should convert API daily data response to chart format', () => {
    const mockData = initService.dailyDataInit;
    const mockProcessedData = [{
      name: "IBM",
      series: [{
        name: "2023-12-01",
        value: "160.5500"
      }]
    }];
    app.processChartData('daily', mockData);
    expect(app.processedDailyData).toEqual(mockProcessedData);
  });

  it('should convert API monthly data response to chart format', () => {
    const mockData = initService.monthlyDataInit;
    const mockProcessedData = [{
      name: "IBM",
      series: [{
        name: "2023-12",
        value: "160.5500"
      }]
    }];
    app.processChartData('monthly', mockData);
    expect(app.processedMonthlyData).toEqual(mockProcessedData);
  });
});
