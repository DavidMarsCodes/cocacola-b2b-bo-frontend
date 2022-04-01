import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, throwError } from 'rxjs';
import { BERespModel } from '../models/backend/BE-response.model';
import { ApiService } from './api.service';
import { EndpointsCodes } from '../enums/endpoints-codes.enum';
import { Banner } from '../models/banners.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ClientNpsPoll } from '../models/client-nps-poll.model';
import { NpsPoll } from '../models/nps-poll.model';


@Injectable({
    providedIn: 'root'
})
export class NpsService {

    private subscriptions = new Subscription();
    readonly EndpointsCodes = EndpointsCodes;
    onNpsPollsChanged: BehaviorSubject<any>;
    clientsNpsPoll: ClientNpsPoll[] = [];

    public polls: NpsPoll[];

    public npsPollSelect: NpsPoll | null;

    constructor(private apiSrv: ApiService, private httpService: HttpClient) {
        this.onNpsPollsChanged = new BehaviorSubject({});
     }


    getAllNpsPoll(): Observable<BERespModel> {
        return new Observable((obs) => {
            this.apiSrv.get(`polls/`, EndpointsCodes.GET_POLLS, {}).subscribe(
                (res) => obs.next(res),
                (err) => obs.error(err),
                () => obs.complete()
            );
        });
    }


    updateNpsPoll(poll: NpsPoll): Observable<BERespModel> {
        return new Observable((obs) => {
            this.apiSrv.post(`polls/`, EndpointsCodes.UPDATE_POLL, poll, {}).subscribe(
                (res) => obs.next(res),
                (err) => obs.error(err),
                () => obs.complete()
            );
        });
    }


    deleteBanners(banners: { banners: any[] }): Observable<BERespModel> {
        return new Observable((obs) => {
            this.apiSrv.post(`polls/delete`, EndpointsCodes.UPDATE_BANNER, banners, {}).subscribe(
                (res) => obs.next(res),
                (err) => obs.error(err),
                () => obs.complete()
            );
        });
    }





}
