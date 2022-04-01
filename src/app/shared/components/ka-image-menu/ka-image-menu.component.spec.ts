import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KaImageMenuComponent } from './ka-image-menu.component';

describe('KaImageMenuComponent', () => {
  let component: KaImageMenuComponent;
  let fixture: ComponentFixture<KaImageMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KaImageMenuComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaImageMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
