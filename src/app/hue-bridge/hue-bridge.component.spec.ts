import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HueBridgeComponent } from './hue-bridge.component';

describe('HueBridgeComponent', () => {
  let component: HueBridgeComponent;
  let fixture: ComponentFixture<HueBridgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HueBridgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HueBridgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
