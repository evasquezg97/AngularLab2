import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TypeheadComponent } from './typehead.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


describe('TypeheadComponent', () => {
  let component: TypeheadComponent;
  let fixture: ComponentFixture<TypeheadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, TypeheadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeheadComponent);
    component = fixture.componentInstance;
    component.autoCompleteData = [["TSC.LON", "Tesco PLC"]]
    component.toggleMode = "daily";
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should read autoCompleteData input correctly', () => {
    expect(component.autoCompleteData[0][0]).toEqual("TSC.LON");
    expect(component.autoCompleteData[0][1]).toEqual("Tesco PLC");
  });

  it('should read toggleMode input correctly', () => {
    expect(component.toggleMode).toEqual("daily");
  });
});
