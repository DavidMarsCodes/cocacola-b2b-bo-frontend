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
import { MatSnackBar} from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-edit-file-modal',
  templateUrl: './edit-file-modal.component.html',
  styleUrls: ['./edit-file-modal.component.scss']
})
export class EditFileModalComponent implements OnInit {
  private readonly subscriptions = new Subscription();
  valueConcept: string = '';
  valueKeys: string;
  upload: any;
  errorUpload: string;
  dataEdit: KeyWord[] = [];
  inputEdit: boolean = true;
  user: UserInfo;
  countryCode: CountryCodes;
  userLocal: UserLocal | null;
  file: Blob;
  readonly ROOT_LANG = 'KEYWORDS.HOME.';
  @Input() public data!:any;
  @Input() public showFooterButtons?= true;
  @Output() modalResponse: EventEmitter<any> = new EventEmitter();

  constructor(private store: Store<{ user: UserInfo; homeStyle: any; userLocal: UserLocal }>, public activeModal: NgbActiveModal,
    private router: Router, private cognitoService: CognitoService, private toastr: ToastrService, private spinner: NgxSpinnerService, private _snackBar: MatSnackBar, private translateService: TranslateService) {
    this.subscriptions.add(this.store.select('userLocal').subscribe((userLocal) => {
      this.userLocal = userLocal;
      this.countryCode = userLocal.geoCountryCode;
    }));
    this.store.select('user').subscribe((user) => (this.user = user));
  }

  ngOnInit(): void {
    this.inputEdit = true;
    this.file = this.data.fileEdit;
    switch (this.data.action) {
      case 'editOne': {
        this.valueConcept = this.data.element.title;
        this.valueKeys = this.data.element.keywords;
        break;
      }
      case 'editMasive':
      case 'deleteMasive': {
        this.dataEdit = [...this.data.element];
        for (const concept of this.dataEdit) {
          this.valueConcept = this.valueConcept + concept.title + ',';
        }
        this.valueConcept = this.valueConcept.substring(0, this.valueConcept.length - 1);
        break;
      }
      case 'deleteBannerSelection': {
        this.dataEdit = [...this.data.element];
        for (const concept of this.dataEdit) {
          this.valueConcept = this.valueConcept + concept.title + ',';
        }
        this.valueConcept = this.valueConcept.substring(0, this.valueConcept.length - 1);
        break;
      }
      case 'addNew': {
        this.inputEdit = false;
        break;
      }
    }
  }

  async reload(url: string): Promise<boolean> {
    switch (this.data.action) {
      case 'editOne': {
        await this.updateUnitFile();
        break;
      }
      case 'editMasive': {
        await this.updateMasiveFile();
        break;
      }
      case 'deleteMasive': {
        await this.deleteMasiveFile();
        break;
      }
      case 'addNew': {
        await this.addNewfile();
        break;
      }
    }
   
    this.activeModal.close(false);
    this.spinner.show();
    await new Promise(f => setTimeout(f, 6000));
    this.spinner.hide();
    await this.router.navigateByUrl('.'+Math.random(), { skipLocationChange: true });
    return this.router.navigateByUrl(url + '?' +Math.random());
  }

  reject(): void {
    this.activeModal.close(false);
  }


  async addNewfile(): Promise<any> {
    this.file.text().then(
      async (dataFile) => {
        let newfile: string = '';
        for (let line of dataFile.split(/[\r\n]+/)) {
          let arrayPrimati = line.split(',');
          if (arrayPrimati[0] === this.valueConcept) {
            this.openMsgSnackBar(this.translateService.instant(this.ROOT_LANG + 'SYNONYM_ALREADY_EXISTS')?.split(','))
            return;
          }
        }
        newfile = this.valueConcept + ',' + this.valueKeys + '\r\n' + dataFile;
        await this.sendFileS3(newfile);
      },
      (error) => console.log('Ocurrió un error inesperado. Por favor envíelo nuevamente.')
    );
  }

  async updateUnitFile(): Promise<any> {
    this.file.text().then(
      async (dataFile) => {
        let newfile: string = '';
        let count = 1;
        for (let line of dataFile.split(/[\r\n]+/)) {
          let arrayPrimati = line.split(',');
          if (arrayPrimati[0] === this.valueConcept) {
            newfile = this.linebBreak(count, dataFile.split(/[\r\n]+/).length, newfile, arrayPrimati[0] + ',' + this.valueKeys);
          } else {
            newfile = this.linebBreak(count, dataFile.split(/[\r\n]+/).length, newfile, line);
          }
          count = count + 1;
        }
        await this.sendFileS3(newfile);
      },
      (error) => console.log('Ocurrió un error inesperado. Por favor envíelo nuevamente.')
    );
  }

  async updateMasiveFile(): Promise<any> {
    this.file.text().then(
      async (dataFile) => {
        let newfile: string = '';
        let count = 1;
        for (let line of dataFile.split(/[\r\n]+/)) {
          let arrayPrimati = line.split(',');
          let concepts = this.valueConcept.split(',');
          if (concepts.includes(arrayPrimati[0])) {
            newfile = this.linebBreak(count, dataFile.split(/[\r\n]+/).length, newfile, arrayPrimati[0] + ',' +  line.replace(arrayPrimati[0]+',','') + ',' + this.valueKeys );
          } else {
            newfile = this.linebBreak(count, dataFile.split(/[\r\n]+/).length, newfile, line);
          }
          count = count + 1;
        }
        await this.sendFileS3(newfile);
      },
      (error) => console.log('Ocurrió un error inesperado. Por favor envíelo nuevamente.')
    );
  }

  async deleteMasiveFile(): Promise<any> {
    this.file.text().then(
      async (dataFile) => {
        let newfile: string = '';
        let count = 1;
        for (let line of dataFile.split(/[\r\n]+/)) {
          let arrayPrimati = line.split(',');
          let concepts = this.valueConcept.split(',');
          if (!concepts.includes(arrayPrimati[0])) {
            newfile = this.linebBreak(count, dataFile.split(/[\r\n]+/).length, newfile, line);
          }
          count = count + 1;
        }
        await this.sendFileS3(newfile);
      },
      (error) => console.log('Ocurrió un error inesperado. Por favor envíelo nuevamente.')
    );
  }

 linebBreak(value1, value2, all, text): string {
    if (value1 !== value2) {
      return all + text + '\r\n';
    } else {
      return all + text;
    }
  }

  async sendFileS3(text): Promise<any> {
    var blob = new Blob([text], { type: 'text/plain', endings: 'native' });
    try {
      await new Promise(f => this.cognitoService.setBlobToBucket(blob,
        `product_synonyms_${this.userLocal.cpgId}_${this.countryCode}_${this.userLocal.organizationId}_es.txt`));
    } catch (error) {
      this.toastr.error(this.errorUpload);
    }
  }

  omit_special_char(event) {
    var k = event.charCode;  
    return (( k > 47 &&  k < 91) || ( k == 44)) || (k > 96 && k < 123)
  }

  openMsgSnackBar(Menssage) {
    this._snackBar.open(Menssage, 'End now', {
      duration: 4000,
    });
  }
  

}
