import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KaButtonMenuComponent } from './ka-button-menu.component';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

describe('KaButtonMenuComponent', () => {
  let component: KaButtonMenuComponent;
  let fixture: ComponentFixture<KaButtonMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, StoreModule],
      declarations: [ KaButtonMenuComponent ],
      providers: [
        provideMockStore({})
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KaButtonMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
