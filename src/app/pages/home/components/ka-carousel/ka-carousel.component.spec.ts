import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KaCarouselComponent } from './ka-carousel.component';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
const initialState = {
  client: {
    clientId: '001',
    organizationId: '124',
  },
  userLocal: {
    geoCountryCode: 'CL',
  },
  user: {
    countryId: 'CL',
  }
};

describe('KaCarouselComponent', () => {
  let component: KaCarouselComponent;
  let fixture: ComponentFixture<KaCarouselComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule
      ],
      providers: [
        provideMockStore({ initialState })
      ],
      declarations: [KaCarouselComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
