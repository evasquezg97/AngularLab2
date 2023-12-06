import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartComponent } from './chart.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartComponent, BrowserAnimationsModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    component.xAxisLabel = "daily";
    component.multi = [{
      "name": "IBM",
      "series": [{
        "name": "2021-01-04",
        "value": "125.35"
      }
      ]
    }];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the 'daily' xAxisLabel`, () => {
    expect(component.xAxisLabel).toEqual('daily');
  });

  it('should read multi input correctly', () => {
    expect(component.multi[0].name).toEqual("IBM");
    expect(component.multi[0].series[0].name).toEqual("2021-01-04");
    expect(component.multi[0].series[0].value).toEqual("125.35");
  });
});
