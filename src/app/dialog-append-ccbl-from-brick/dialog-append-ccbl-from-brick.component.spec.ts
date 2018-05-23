import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAppendCcblFromBrickComponent } from './dialog-append-ccbl-from-brick.component';

describe('DialogAppendCcblFromBrickComponent', () => {
  let component: DialogAppendCcblFromBrickComponent;
  let fixture: ComponentFixture<DialogAppendCcblFromBrickComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogAppendCcblFromBrickComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAppendCcblFromBrickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
