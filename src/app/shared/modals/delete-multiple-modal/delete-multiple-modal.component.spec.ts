import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { CognitoService } from '../../../core/services/cognito.service';
import { ToastrModule } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';
import { MatMenuModule } from '@angular/material/menu';
import { DeleteMultipleModalComponent } from './delete-multiple-modal.component';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BERespModel } from 'src/app/core/models/backend/BE-response.model';

const initialState = {
  userLocal: {
    geoCountryCode: 'CL',
  },
  user: {
    countryId: 'CL',
    jwt: 'jdskfsdjklafncjkljeñoMSDKÑSLNCVJKDSNV',
    email: 'asd@asd.com'
  },
};


const validResponse = {
  httpStatus: 200,
  ok: true,
  code: 0,
  data: [

    {

      active: true,
      date: "2022-01-21T07:16:57.000Z",
      device: "Desktop",
      idBanner: 1,
      lastUpdate: "2022-01-22T07:16:57.000Z",
      title: "Refréscate este verano con Coca-Cola"
    }
  ]
} as BERespModel;




describe('DeleteMultipleModalComponent', () => {
  let component: DeleteMultipleModalComponent;
  let fixture: ComponentFixture<DeleteMultipleModalComponent>;
  let spyCognitoService: jasmine.SpyObj<CognitoService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteMultipleModalComponent],
      imports: [MatMenuModule,ToastrModule.forRoot(), RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        provideMockStore({ initialState }),
        { provide: CognitoService, useValue: spyCognitoService }
        ,
          NgbActiveModal,
          NgbModal
      
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteMultipleModalComponent);
    component = fixture.componentInstance;
 
    fixture.detectChanges();
    
  });

  fit('should create', () => {
    expect(component).toBeTruthy();
  });

  it('line breack', () => {
    expect(component).toBeTruthy();
    expect(component.linebBreak('1', '2', '3,4,5', '7,8')).toEqual('3,4,57,8\r\n');
  });


 it('deleteMultiplesBanner',  async () => {
   expect(component).toBeTruthy();
   component.ngOnInit();
   fixture.detectChanges();
    expect(component.deleteMultiplesBanner).toHaveBeenCalled;
})



});


