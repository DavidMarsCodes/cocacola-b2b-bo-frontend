import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KaNotFoundComponent } from './not-found.component';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';


describe('KaNotFoundComponent', () => {
  let component: KaNotFoundComponent;
  let fixture: ComponentFixture<KaNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ StoreModule, TranslateModule.forRoot()],
      declarations: [KaNotFoundComponent],
      providers: [
        provideMockStore({})
      ],

    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KaNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
