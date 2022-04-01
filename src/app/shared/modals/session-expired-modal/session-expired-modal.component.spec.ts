import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SessionExpiredModalComponent } from './session-expired-modal.component';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('SessionExpiredModalComponent', () => {
  let component: SessionExpiredModalComponent;
  let fixture: ComponentFixture<SessionExpiredModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgbModule,
        TranslateModule.forRoot()
      ],
      declarations: [SessionExpiredModalComponent],
      providers: [
        NgbActiveModal,
        NgbModal
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionExpiredModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
