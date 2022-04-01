import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmModalComponent } from './confirm-modal.component';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

const data = {
  title: 'test',
  text: 'text test',
  description: 'description',
  image: 'image_route',
  id: '001',
  rejectBtnLabel: 'ok'
};

describe('ConfirmModalComponent', () => {
  let component: ConfirmModalComponent;
  let fixture: ComponentFixture<ConfirmModalComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmModalComponent],
      imports: [
        NgbModule,
      ],
      providers: [
        NgbActiveModal,
        NgbModal
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmModalComponent);
    component = fixture.componentInstance;
    component.data = data;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
