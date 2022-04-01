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
import { CognitoService } from '../../../core/services/cognito.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ClientBanner } from 'src/app/core/models/client-banner.model';
import { NpsPoll } from 'src/app/core/models/nps-poll.model';
import { NpsService } from 'src/app/core/services/nps.service';
import { ClientNpsPoll } from 'src/app/core/models/client-nps-poll.model';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-detail-form-nps-poll',
  templateUrl: './detail-form-nps-poll.component.html',
  styleUrls: ['./detail-form-nps-poll.component.scss'],

})
export class DetailFormNpsPollComponent implements OnInit {
  pollForm: FormGroup;

  colorControl = new FormControl('primary');
  fontSizeControl = new FormControl(16, Validators.min(10));
  readonly ROOT_LANG = 'NPS.FORM_DETAIL.';
  serviceError = false;
  serviceErrorMsg: string;
  restoreCode: string;
  confirmCode: string;
  private readonly subscriptions = new Subscription();
  countryCode: CountryCodes;
  nps_poll: NpsPoll;
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
  secondaryActive: boolean = false;
  applyToAll: boolean = false;
  cancelled = false;
  arrayString: any;
  upload: any;
  spaceRegex = /(\r\n|\n|\r)/gm;
  regexNullValue = [/;;;;/];
  updateClientBanners: ClientBanner[] = [];
  finalBlobFile: Blob;


  constructor(private npsServices: NpsService,
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

   
    this.nps_poll = this.npsServices.npsPollSelect;
    this.applyToAll = this.nps_poll.applyToAll;
    this.errorFormat = this.translateService.instant(this.ROOT_LANG + 'ERROR_FORMAT')?.split(',');
    this.errorUpload = this.translateService.instant(this.ROOT_LANG + 'ERROR_UPLOAD')?.split(',');
    this.errorSize = this.translateService.instant(this.ROOT_LANG + 'ERROR_SIZE')?.split(',');
  }

  ngOnInit(): void {
    this.initForm();
  }


  private initForm(): void {

    this.pollForm = new FormGroup({
      pollId: new FormControl(this.nps_poll.pollId),
      mainQuestion: new FormControl(this.nps_poll.mainQuestion),
      description: new FormControl(this.nps_poll.description, [Validators.required]),
      secondaryQuestion: new FormControl({ value: this.nps_poll.secondaryQuestion, disabled: !this.nps_poll.secondaryActive }),
      active: new FormControl(this.nps_poll.active === "Si"),
      applyToAll: new FormControl(this.nps_poll.applyToAll),
      secondaryActive: new FormControl(this.nps_poll.secondaryActive),
      scaleFromName: new FormControl(this.nps_poll.scaleFromName), 
      scaleToName:new FormControl(this.nps_poll.scaleToName),
      scaleFrom: new FormControl(this.nps_poll.scaleFrom), 
      scaleTo:new FormControl(this.nps_poll.scaleTo),

    });
  }

  public toggle(event: MatSlideToggleChange) {
    this.secondaryActive = event.checked;
    this.secondaryActive ? this.pollForm.controls['secondaryQuestion'].enable() : this.pollForm.controls['secondaryQuestion'].disable();

  }


  public toggleApplyToAll(event: MatSlideToggleChange) {
    this.applyToAll = event.checked;
  }

  async saveChanges(): Promise<any> {
    this.nps_poll = this.pollForm.value;


    const resp = await this.updateNpsPoll();
    if (resp.httpStatus == 201) {
      const pollId = resp.data.bannerId;
      this.nps_poll.pollId = pollId;

      // Upload File S3
      if (this.clientFile) {

        if (this.clientFile.type) {

          if (this.clientFile.type.indexOf('text/csv') || this.clientFile.type.indexOf('application/vnd.ms-excel') || this.clientFile.type.indexOf('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
            try {

              let updateClientsPoll = this.putIdPollInFileClients();

              const finalArray = [... this.npsServices.clientsNpsPoll, ...updateClientsPoll];

              let csvData = this.ConvertToCSV(finalArray, ['CPG_ID', 'COUNTRY_ID', 'ORGANIZATION_ID', 'POLL_ID', 'CLIENT_ID']);
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

  putIdPollInFileClients = (): ClientNpsPoll[] => {

    const updateClientsPoll: ClientNpsPoll[] = [];
    for (var i = 1; i < this.arrayString.length; i++) {
      var array = this.arrayString[i].split(',');
      var clientBannerFilter = array.filter(item => item !== array);
      if (!this.spaceRegex.test(array)) {

        var isMatch = this.regexNullValue.some(function (rx) { return rx.test(clientBannerFilter); })

        if (!isMatch && clientBannerFilter[0]) {

          var clientPollSplit = array[0].split(';');
          var clientPollObj: ClientNpsPoll
            = { CPG_ID: clientPollSplit[0], COUNTRY_ID: clientPollSplit[1], ORGANIZATION_ID: clientPollSplit[2], POLL_ID: clientPollSplit[3], CLIENT_ID: clientPollSplit[4] };
          clientPollObj.POLL_ID = this.nps_poll.pollId.toString();

          updateClientsPoll.push(clientPollObj);

        }

      }

    }


    return updateClientsPoll;
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

  updateNpsPoll(): Promise<any> {
    return this.npsServices.updateNpsPoll(this.nps_poll).toPromise();

  }

}
