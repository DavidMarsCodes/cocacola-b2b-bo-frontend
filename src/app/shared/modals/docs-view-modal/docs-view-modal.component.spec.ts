import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocsViewModalComponent } from './docs-view-modal.component';

import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Store, StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { of } from 'rxjs';

// Store Mocke
class StoreMock {
  initialState = {
    userLocal: {
      geoCountryCode: 'CL',
      organizationId: '124',
    },
  };
  // How we did it before
  select = jasmine.createSpy().and.returnValue(of(this.initialState));
  dispatch = jasmine.createSpy();
}

describe('DocsViewModalComponent', () => {
  let component: DocsViewModalComponent;
  let fixture: ComponentFixture<DocsViewModalComponent>;
  // Variable del componte que vine del store.
  let userLocal: any;

  beforeEach(async () => {
    // Asigna variable.
    userLocal = { geoCountryCode: 'CL' };

    await TestBed.configureTestingModule({
      declarations: [DocsViewModalComponent],
      imports: [HttpClientModule, ToastrModule.forRoot(), NgbModule, StoreModule.forRoot({}, {}), TranslateModule.forRoot()],
      providers: [
        NgbActiveModal,
        NgbModal,
        {
          provide: Store,
          useClass: StoreMock,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });
});
