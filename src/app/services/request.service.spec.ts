import { TestBed } from '@angular/core/testing';
import { RequestService } from './request.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Autocomplete } from '../models/autocomplete.model';

describe('RequestService', () => {
  let requestService: RequestService;
  let HTTPController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RequestService]
    });
    requestService = TestBed.inject(RequestService);
    HTTPController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(requestService).toBeTruthy();
  });

  describe('tests for getData', () => {
    it('should return an Observable<Autocomplete>', (doneFn) => {
      //Arrange
      const mockAutocomplete: Autocomplete = {
        "bestMatches": [{
          "1. symbol": "TSCO.LON",
          "2. name": "Tesco PLC",
          "3. type": "Equity",
          "4. region": "United Kingdom",
          "5. marketOpen": "08:00",
          "6. marketClose": "16:30",
          "7. timezone": "UTC+01",
          "8. currency": "GBX",
          "9. matchScore": "1.0000"
        }]
      };

      //Act
      requestService.getData("autocomplete", "tesco").subscribe((data) => {
        //Assert
        expect(data).toEqual(mockAutocomplete);
        doneFn();
      });

      //HTTP configuration
      const request = HTTPController.expectOne(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=tesco&apikey=demo`);
      request.flush(mockAutocomplete);
      HTTPController.verify();
    });
  });
});
