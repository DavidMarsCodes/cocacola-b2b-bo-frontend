import { DiscountTypes } from './../../../core/enums/discount-types.enum';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DiscretionaryDiscountService } from 'src/app/core/services/discretionary-discount.service';
import { DiscretionaryDiscount, Discount } from '../../../core/models/discretionary-discount.model';
import * as moment from 'moment';
import { formatNumber, formatPercent, Location, registerLocaleData } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { UserInfo } from 'src/app/core/models/user-info.model';
import { Store } from '@ngrx/store';
import { UserLocal } from 'src/app/core/models/user-local.model';
import { CountryCodes } from 'src/app/core/enums/country-codes.enum';
import { MatTableDataSource } from '@angular/material/table';
import es from '@angular/common/locales/es';

@Component({
  selector: 'app-detail-form-discount',
  templateUrl: './detail-form-discount.component.html',
  styleUrls: ['./detail-form-discount.component.scss'],

})
export class DetailFormDiscountComponent implements OnInit {
  discountForm: FormGroup;
  disocuntForm: FormGroup;
  colorControl = new FormControl('primary');
  fontSizeControl = new FormControl(16, Validators.min(10));
  readonly ROOT_LANG = 'DISCOUNTS.FORM_DETAIL.';
  serviceError = false;
  serviceErrorMsg: string;
  restoreCode: string;
  confirmCode: string;
  codeSku: number;
  private readonly subscriptions = new Subscription();
  countryCode: CountryCodes;
  discretionaryDiscount: DiscretionaryDiscount;
  validityTo: string;
  displayedColumns: string[] = ['percentage', 'escaleQtyMin', 'escaleQtyMax'];
  dataSource: MatTableDataSource<Discount>;
  selectedCountry: string;


  constructor(private discretionaryDiscountServices: DiscretionaryDiscountService,
    private _formBuilder: FormBuilder,
    private location: Location, private toastrService: ToastrService,
    private translateService: TranslateService,
    private store: Store<{ user: UserInfo; homeStyle: any; userLocal: UserLocal }>,
  ) {
    registerLocaleData(es);
    this.subscriptions.add(this.store.select('userLocal').subscribe((userLocal) => (this.countryCode = userLocal.geoCountryCode)));
    this.discretionaryDiscount = this.discretionaryDiscountServices.discretionaryDiscountSelect;
    this.codeSku = +this.discretionaryDiscount.erpDiscountId;
  }

  get dForm() {
    return this.discountForm.controls;
  }

  get formDataFieldsInputs() {
    return <FormArray>this.dForm.percentDiscounts;
  }


  patchValuesPercentajeDiscount(discount: Discount): FormGroup {

    return this._formBuilder.group({
      percentage: [{ value: formatNumber(+discount.percentage, 'es', '1.0-2'), disabled: true }],
      escaleQtyMin: [{ value: discount.escaleQtyMin, disabled: true }],
      escaleQtyMax: [{ value: discount.escaleQtyMax, disabled: true }],
    });
  }

  ngOnInit(): void {
    this.discountForm = this.initForm();
    this.discountsPercentageFields();
  }

  discountsPercentageFields(): void {
    const fields = <FormArray>this.disocuntForm.controls.percentDiscounts;
    this.discretionaryDiscount.discounts.forEach((discount: Discount) => {
      fields.push(this.patchValuesPercentajeDiscount(discount));
    });

    this.dataSource = new MatTableDataSource(this.discretionaryDiscount.discounts);

  }

  private initForm(): FormGroup {
    this.validityTo = moment(new Date(this.discretionaryDiscount.validityTo).toISOString().replace('Z', '')).format('DD/MM/YYYY');
    return this.disocuntForm = new FormGroup({
      discountId: new FormControl(this.discretionaryDiscount.discountId),
      name: new FormControl(this.discretionaryDiscount.name, [Validators.required]),
      detail: new FormControl(this.discretionaryDiscount.detail),
      validityTo: new FormControl({ value: this.validityTo, disabled: true }),
      type: new FormControl({ value: this.discretionaryDiscount.discountType === 'S' ? DiscountTypes.SCALE : DiscountTypes.PERCENT, disabled: true }),
      limitPrice: new FormControl({ value: this.discretionaryDiscount.limitPrice, disabled: false }),
      percentDiscounts: this._formBuilder.array([]),
    });
  }

  async saveChanges(): Promise<any> {
    this.discretionaryDiscount = this.disocuntForm.value;
    const resp = await this.updateDiscount();
    if (resp.httpStatus == 201) {
      this.location.back();
      this.translateService.use(this.countryCode).subscribe(() => {
        const messageSuccess = this.translateService.instant(this.ROOT_LANG + 'SAVE_SUCCESS');
        this.toastrService.success(messageSuccess);
      });
    }
  }

  cancelChanges(): void {
    this.location.back();
  }

  updateDiscount(): Promise<any> {
    return this.discretionaryDiscountServices.updateDiscretionaryDiscount(this.discretionaryDiscount).toPromise();
  }


}
