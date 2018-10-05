import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PwddialogComponent } from './pwddialog.component';

describe('PwddialogComponent', () => {
  let component: PwddialogComponent;
  let fixture: ComponentFixture<PwddialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PwddialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PwddialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
