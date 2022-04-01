import { TranslateModule } from '@ngx-translate/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingModalComponent } from './loading-modal.component';

describe('LoadingModalComponent', () => {
  let component: LoadingModalComponent;
  let fixture: ComponentFixture<LoadingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TranslateModule.forRoot(), ],
      declarations: [LoadingModalComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
