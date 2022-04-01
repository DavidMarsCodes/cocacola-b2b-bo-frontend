import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { EndpointsCodes } from 'src/app/core/enums/endpoints-codes.enum';

@Injectable({
  providedIn: 'root',
})
export class GeoLocationService {
  customUrl = 'https://r3ogh5dbzf.execute-api.us-east-1.amazonaws.com/dev/v1/public/api/';
  readonly EndpointsCodes = EndpointsCodes;

  constructor(private apiSrv: ApiService, private httpClient: HttpClient) {}

  getIpAddress(): Observable<any> {
    return new Observable((obs) => {
      this.httpClient.get('https://api.ipify.org?format=json').subscribe(
        (res) => obs.next(res),
        (err) => obs.error(err),
        () => obs.complete()
      );
    });
  }

  getLocationByIp(ip: string): Observable<any> {
    return new Observable((obs) => {
      this.apiSrv.get('', EndpointsCodes.GET_LOCATION_BY_IP, { customUrl: this.customUrl + 'geoLocation?ip=' + ip, showError: false }).subscribe(
        (res) => obs.next(res),
        (err) => obs.error(err),
        () => obs.complete()
      );
    });
  }
}
