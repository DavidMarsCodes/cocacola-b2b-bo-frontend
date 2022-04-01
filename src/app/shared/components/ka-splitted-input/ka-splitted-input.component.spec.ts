import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KaSplittedInputComponent } from './ka-splitted-input.component';

describe('KaSplittedInputComponent', () => {
  let component: KaSplittedInputComponent;
  let fixture: ComponentFixture<KaSplittedInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KaSplittedInputComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaSplittedInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
