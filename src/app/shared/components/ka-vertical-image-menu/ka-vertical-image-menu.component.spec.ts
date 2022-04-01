import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KaVerticalImageMenuComponent } from './ka-vertical-image-menu.component';

describe('KaVerticalImageMenuComponent', () => {
  let component: KaVerticalImageMenuComponent;
  let fixture: ComponentFixture<KaVerticalImageMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KaVerticalImageMenuComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaVerticalImageMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
