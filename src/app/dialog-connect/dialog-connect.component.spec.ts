import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConnectComponent } from './dialog-connect.component';

describe('DialogConnectComponent', () => {
  let component: DialogConnectComponent;
  let fixture: ComponentFixture<DialogConnectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogConnectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogConnectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
