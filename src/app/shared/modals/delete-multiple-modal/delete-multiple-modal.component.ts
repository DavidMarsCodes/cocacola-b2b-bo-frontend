import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { KeyWord } from 'src/app/core/models/keyword.model';
import { Router } from '@angular/router';
import { CognitoService } from 'src/app/core/services/cognito.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserInfo } from 'src/app/core/models/user-info.model';
import { CountryCodes } from 'src/app/core/enums/country-codes.enum';
import { UserLocal } from 'src/app/core/models/user-local.model';
import { Banner } from 'src/app/core/models/banners.model';
import { BannersService } from 'src/app/core/services/banners.service';

@Component({
  selector: 'app-delete-multiple-modal',
  templateUrl: './delete-multiple-modal.component.html',
  styleUrls: ['./delete-multiple-modal.component.scss']
})
export class DeleteMultipleModalComponent implements OnInit {
  private readonly subscriptions = new Subscription();
  valueConcept: string = '';
  banners: Banner[] = [];
  upload: any;
  errorUpload: string;

  inputEdit: boolean = true;
  user: UserInfo;
  countryCode: CountryCodes;
  userLocal: UserLocal | null;
  readonly ROOT_LANG = 'BANNERS.HOME.';
  @Input() public data!: any;
  @Input() public showFooterButtons?= true;
  @Output() modalResponse: EventEmitter<any> = new EventEmitter();

  constructor(private bannersService: BannersService, private store: Store<{ user: UserInfo; homeStyle: any; userLocal: UserLocal }>, public activeModal: NgbActiveModal,
    private router: Router, private cognitoService: CognitoService, private toastr: ToastrService, private spinner: NgxSpinnerService) {
    this.subscriptions.add(this.store.select('userLocal').subscribe((userLocal) => {
      this.userLocal = userLocal;
      this.countryCode = userLocal.geoCountryCode;
    }));
    this.store.select('user').subscribe((user) => (this.user = user));
  }

  ngOnInit(): void {
    this.inputEdit = true;
    this.valueConcept = this.data.title;
    this.banners = this.data.banners;

  }

  async reload(url: string): Promise<boolean> {

    var arrayBanners = { banners: [] };

    this.spinner.show();
    this.banners.forEach(banner => {
      var bannerId = { bannerId: banner.bannerId };
      arrayBanners.banners.push(bannerId);

      const bannerIndex = this.bannersService.banners.indexOf(banner);

      this.bannersService.banners.splice(bannerIndex, 1);
    });

    this.bannersService.deleteBanners(arrayBanners).toPromise();

    this.activeModal.close(false);

    await new Promise(f => setTimeout(f, 200));
    this.bannersService.onBannersChanged.next(this.banners);
    this.spinner.hide();
    return true
  }

  reject(): void {
    this.activeModal.close(false);
  }



  async deleteMultiplesBanner(): Promise<any> {

  }

  linebBreak(value1, value2, all, text): string {
    if (value1 !== value2) {
      return all + text + '\r\n';
    } else {
      return all + text;
    }
  }



}
