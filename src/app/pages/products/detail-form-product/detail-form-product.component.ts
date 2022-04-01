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
import { Product } from 'src/app/core/models/product.model';
import { ProductsService } from 'src/app/core/services/products.service';
import { CognitoService } from '../../../core/services/cognito.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-detail-form-product',
  templateUrl: './detail-form-product.component.html',
  styleUrls: ['./detail-form-product.component.scss'],

})
export class DetailFormProductComponent implements OnInit {
  productForm: FormGroup;

  colorControl = new FormControl('primary');
  fontSizeControl = new FormControl(16, Validators.min(10));
  readonly ROOT_LANG = 'PRODUCTS.FORM_DETAIL.';
  serviceError = false;
  serviceErrorMsg: string;
  restoreCode: string;
  confirmCode: string;
  private readonly subscriptions = new Subscription();
  countryCode: CountryCodes;
  product: Product;
  validityTo: string;
  loading: boolean;
  codeSku: number;
  image: any;
  file: File;
  errorFormat: string;
  errorUpload: string;
  errorSize: string;
  user: UserLocal;
  imageRoute: string;

  categories: ProductGroup[] = [
  ];
  macrocategories: ProductGroup[] = [
  ];

  constructor(private productServices: ProductsService,
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

    
    this.product = this.productServices.productSelect;
    console.log(this.product)
    this.imageRoute = this.product.image;
    this.codeSku = +this.product.erpProductId;
    this.errorFormat = this.translateService.instant(this.ROOT_LANG + 'ERROR_FORMAT')?.split(',');
    this.errorUpload = this.translateService.instant(this.ROOT_LANG + 'ERROR_UPLOAD')?.split(',');
    this.errorSize = this.translateService.instant(this.ROOT_LANG + 'ERROR_SIZE')?.split(',');
  }

  ngOnInit(): void {
    this.getCategoriesFilter();
    this.initForm();
    this.getImage();
  }

  private getCategoriesFilter(): void {
    this.productServices.getCategoriesFilter().subscribe(
      async (res) => {
        this.categories = res.data.categories;
        this.macrocategories = res.data.macrocategories;
        if (this.categories.length > 0) {

        } else {
          this.loading = false;
        }
      },
      (error) => this.toastrService.error('Ocurrió un error inesperado. Por favor envíelo nuevamente.')
    );
  }

  private initForm(): void {
    this.productForm = new FormGroup({
      productId: new FormControl(this.product.productId),
      name: new FormControl(this.product.name, [Validators.required]),
      brand: new FormControl(this.product.brand),
      category: new FormControl(this.product.category.id),
      macrocategory: new FormControl(this.product.macrocategory.id),
      size: new FormControl(this.product.size),
      package: new FormControl(this.product.package),
      locked: new FormControl(this.product.locked),
    });
  }

  async saveChanges(): Promise<any> {
    this.product = this.productForm.value;
    const resp = await this.updateDiscount();
    if (resp.httpStatus == 201) {
      this.location.back();
      this.translateService.use(this.countryCode).subscribe(() => {
        const messageSuccess = this.translateService.instant(this.ROOT_LANG + 'SAVE_SUCCESS');
        this.toastrService.success(messageSuccess);
      });
    }
  }

  getImage(): void {
    if (this.imageRoute !== 'NOT') {
      this.cognitoService.getImageFromBucket(environment.PRODUCT_IMAGES_S3_HOST, this.imageRoute, 'product').then(
        async (res) => {
          if (res) {
            this.image = res;
          }
        }
      );
    }
  }

  onFileChange(files): void {
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
      // tslint:disable-next-line:variable-name
      reader.onload = (_event) => {
        this.image = reader.result;
      };
    }
  }

  cancelChanges(): void {
    this.location.back();
  }

  updateDiscount(): Promise<any> {
    this.product.image = this.imageRoute;
    if (this.file && this.imageRoute === 'NOT') {
      this.product.image = `products/${this.user.cpgId}_${this.user.geoCountryCode}_${this.user.organizationId}_${this.codeSku.toString().padStart(18, '0')}.${this.file.name.split('.')[1]}`;
    }
    if (this.file) {
      try {
        this.cognitoService.setImageToBucket(this.file, this.product.image, 'product');
      } catch (error) {
        this.toastr.error(this.errorUpload);
      }
    }
    return this.productServices.updateProduct(this.product).toPromise();
  }

}

interface ProductGroup {
  productGroupId: number;
  name: string;
}
