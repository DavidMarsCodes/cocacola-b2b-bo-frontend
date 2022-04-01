import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, throwError } from 'rxjs';
import { BERespModel } from '../models/backend/BE-response.model';
import { ApiService } from './api.service';
import { EndpointsCodes } from 'src/app/core/enums/endpoints-codes.enum';
import { Banner } from '../models/banners.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ClientBanner } from '../models/client-banner.model';


@Injectable({
    providedIn: 'root'
})
export class BannersService {

    private subscriptions = new Subscription();
    readonly EndpointsCodes = EndpointsCodes;
    onBannersChanged: BehaviorSubject<any>;
    public banners: Banner[];

    public bannerSelect: Banner | null;
    clientBanners: ClientBanner[] = [];
    constructor(private apiSrv: ApiService, private httpService: HttpClient) {
        this.onBannersChanged = new BehaviorSubject({});
     }


    getAllBanners(): Observable<BERespModel> {
        return new Observable((obs) => {
          this.apiSrv
            .get(`banners`, EndpointsCodes.GET_BANNERS, {})
            .subscribe(
              (res) => obs.next(res),
              (err) => obs.error(err),
              () => obs.complete()
            );
        });
      }


    updateBanner(banner: Banner): Observable<BERespModel> {
        return new Observable((obs) => {
            this.apiSrv.post(`banner/`, EndpointsCodes.UPDATE_BANNER, banner, {}).subscribe(
                (res) => obs.next(res),
                (err) => obs.error(err),
                () => obs.complete()
            );
        });
    }


    deleteBanners(banners: { banners: any[] }): Observable<BERespModel> {
        return new Observable((obs) => {
            this.apiSrv.post(`banners/delete`, EndpointsCodes.UPDATE_BANNER, banners, {}).subscribe(
                (res) => obs.next(res),
                (err) => obs.error(err),
                () => obs.complete()
            );
        });
    }





}
