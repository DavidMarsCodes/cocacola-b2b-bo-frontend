import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { UserInfo } from 'src/app/core/models/user-info.model';
import { Store } from '@ngrx/store';
import { UserLocal } from 'src/app/core/models/user-local.model';
import { CountryCodes } from 'src/app/core/enums/country-codes.enum';
import { ProductsService } from 'src/app/core/services/products.service';
import { CognitoService } from '../../../core/services/cognito.service';
import { Banner } from 'src/app/core/models/banners.model';
import { BannersService } from 'src/app/core/services/banners.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ClientBanner } from 'src/app/core/models/client-banner.model';

@Component({
  selector: 'app-detail-form-banner',
  templateUrl: './detail-form-banner.component.html',
  styleUrls: ['./detail-form-banner.component.scss'],

})
export class DetailFormBannerComponent implements OnInit {
  bannerForm: FormGroup;

  colorControl = new FormControl('primary');
  fontSizeControl = new FormControl(16, Validators.min(10));
  readonly ROOT_LANG = 'BANNERS.FORM_DETAIL.';
  serviceError = false;
  serviceErrorMsg: string;
  restoreCode: string;
  confirmCode: string;
  private readonly subscriptions = new Subscription();
  countryCode: CountryCodes;
  banner: Banner;
  validityTo: string;
  loading: boolean;
  codeSku: number;
  image: any;
  file: File;
  clientFile: File;
  errorFormat: string;
  errorUpload: string;
  errorSize: string;
  user: UserLocal;
  imageRoute: string;
  cancelled = false;
  arrayString: any;
  upload: any;
  spaceRegex = /(\r\n|\n|\r)/gm;
  regexNullValue = [/;;;;/];
  updateClientBanners: ClientBanner[] = [];
  finalBlobFile: Blob;


  constructor(private bannerServices: BannersService,
    private ngxSpinner: NgxSpinnerService,
    private location: Location, private toastrService: ToastrService,
    private translateService: TranslateService,
    private store: Store<{ user: UserInfo; homeStyle: any; userLocal: UserLocal; userInfo: UserInfo }>,
    private cognitoService: CognitoService,
    private toastr: ToastrService,
  ) {
    this.subscriptions.add(this.store.select('userLocal').subscribe((userLocal) => {
      this.countryCode = userLocal.geoCountryCode;
      this.user = userLocal;
    }));

    this.banner = this.bannerServices.bannerSelect;

    this.imageRoute = this.banner.image;

    this.errorFormat = this.translateService.instant(this.ROOT_LANG + 'ERROR_FORMAT')?.split(',');
    this.errorUpload = this.translateService.instant(this.ROOT_LANG + 'ERROR_UPLOAD')?.split(',');
    this.errorSize = this.translateService.instant(this.ROOT_LANG + 'ERROR_SIZE')?.split(',');
  }

  ngOnInit(): void {
    this.initForm();
    this.getImage();
  }


  private initForm(): void {
    this.bannerForm = new FormGroup({
      bannerId: new FormControl(this.banner.bannerId),
      date: new FormControl({ value: this.banner.date, disabled: this.banner.bannerId === 0 }),
      title: new FormControl(this.banner.title, [Validators.required]),
      device: new FormControl(this.banner.device, [Validators.required]),
      active: new FormControl(this.banner.active),
      deleted: new FormControl(this.banner.deleted),
      order: new FormControl(this.banner.order)
    });
  }

  async saveChanges(): Promise<any> {
    this.banner = this.bannerForm.value;

    if (this.file && this.file.name) {
      this.banner.image = `${this.user.cpgId}_${this.user.geoCountryCode}_${this.user.organizationId}_.${this.file.name.split('.')[1]}`;
    }

    else if (!this.imageRoute) {
      this.banner.image = "";
    }

    const resp = await this.updateBanner();
    if (resp.httpStatus == 201) {
      const bannerId = resp.data.bannerId;
      this.banner.bannerId = bannerId;
      //Upload Image S3
      if (this.file) {
        this.banner.image = this.banner.image.replace('.', `${bannerId}.`);
      }
      if (this.file) {
        try {
          this.cognitoService.setImageToBucket(this.file, this.banner.image, 'banners');
        } catch (error) {
          this.toastr.error(this.errorUpload);
        }
      }
      // Upload File S3
      if (this.clientFile) {

        if (this.clientFile.type) {

          if (this.clientFile.type.indexOf('text/csv') || this.clientFile.type.indexOf('application/vnd.ms-excel') || this.clientFile.type.indexOf('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
            try {

              let updateClientBanners = this.putIdBannerInFileClients();

              const finalArray = [... this.bannerServices.clientBanners, ...updateClientBanners];

              let csvData = this.ConvertToCSV(finalArray, ['CPG_ID', 'COUNTRY_ID', 'ORGANIZATION_ID', 'BANNER_ID', 'CLIENT_ID']);
              let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });

              this.clientFile = this.blobToFile(blob, environment.B2B_BO_BANNER_CLIENT_S3_HOST);

              this.upload = this.cognitoService.setFileToBucket(this.clientFile, this.clientFile.name);

              this.location.back();
              this.translateService.use(this.countryCode).subscribe(() => {
                const messageSuccess = this.translateService.instant(this.ROOT_LANG + 'SAVE_SUCCESS');
                this.toastrService.success(messageSuccess);
              });

            } catch (error) {
              this.toastr.error(this.errorUpload);
            }
          } else {
            this.toastr.error(this.errorFormat);
            this.clientFile = undefined;
          }

        }

      }

      else {
        this.location.back();
        this.translateService.use(this.countryCode).subscribe(() => {
          const messageSuccess = this.translateService.instant(this.ROOT_LANG + 'SAVE_SUCCESS');
          this.toastrService.success(messageSuccess);
        });
      }


    }
  }


  getImage(): void {
    if (this.imageRoute !== '' && this.imageRoute !== null && this.banner.bannerId !== 0) {
      this.cognitoService.getImageFromBucket(environment.PRODUCT_IMAGES_S3_HOST, this.imageRoute, 'banners').then(
        async (res) => {
          if (res) {
            this.image = res;
          }
        }
      );
    }

  }



  onImageChange(files): void {
    this.file = files[0];
    if (this.file.type.indexOf('image/') !== 0) {
      this.toastr.error(this.errorFormat);
      this.file = undefined;
    } else if (this.file.size > 2 * 1024 * 1024) {
      this.toastr.error(this.errorSize);
      this.file = undefined;
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(this.file);

      reader.onload = (_event) => {
        this.image = reader.result;
      };
    }
  }



  onFileChange(files): void {
    this.cancelled = false;
    this.clientFile = files[0];

    let fileReader: FileReader = new FileReader();
    fileReader.readAsText(this.clientFile);
    fileReader.onload = ev => {
      let csvdata = fileReader.result.toString();
      let body = { data: csvdata };

      let csvDataBuffer = JSON.stringify(body);
      let csvData = JSON.parse(csvDataBuffer).data;
      let csvDataString = csvData.toString("utf8");

      this.arrayString = csvDataString.split(this.spaceRegex);



    };

  }

  putIdBannerInFileClients = (): ClientBanner[] => {

    const updateClientBanners: ClientBanner[] = [];
    for (var i = 1; i < this.arrayString.length; i++) {
      var array = this.arrayString[i].split(',');
      var clientBannerFilter = array.filter(item => item !== array);
      if (!this.spaceRegex.test(array)) {

        var isMatch = this.regexNullValue.some(function (rx) { return rx.test(clientBannerFilter); })

        if (!isMatch && clientBannerFilter[0]) {

          var clientBannerSplit = array[0].split(';');
          var clientBannerObj: ClientBanner = { CPG_ID: clientBannerSplit[0], COUNTRY_ID: clientBannerSplit[1], ORGANIZATION_ID: clientBannerSplit[2], BANNER_ID: clientBannerSplit[3], CLIENT_ID: clientBannerSplit[4] };
          clientBannerObj.BANNER_ID = this.banner.bannerId.toString();

          updateClientBanners.push(clientBannerObj);

        }

      }

    }


    return updateClientBanners;
  }


  public blobToFile = (theBlob: Blob, fileName: string): File => {
    var b: any = theBlob;
    b.lastModifiedDate = new Date();
    b.name = fileName;
    return <File>theBlob;
  }

  ConvertToCSV(objArray, headerList) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = '';
    for (let index in headerList) {
      row += headerList[index] + ';';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (let index in headerList) {
        let head = headerList[index];

        if (head === 'CPG_ID' && array[i][head].length === 1) {
          line += '00' + array[i][head] + ';';
        }
        else {
          line += array[i][head] + ';';

        }

      }
      str += line + '\r\n';

    }
    return str;
  }

  cancelChanges(): void {
    this.location.back();
  }

  updateBanner(): Promise<any> {
    this.banner.deleted = false;
    return this.bannerServices.updateBanner(this.banner).toPromise();

  }

}
