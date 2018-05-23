import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogBridgeBleComponent } from './dialog-bridge-ble.component';

describe('DialogBridgeBleComponent', () => {
  let component: DialogBridgeBleComponent;
  let fixture: ComponentFixture<DialogBridgeBleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogBridgeBleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogBridgeBleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
