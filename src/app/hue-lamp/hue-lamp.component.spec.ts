import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HueLampComponent } from './hue-lamp.component';

describe('HueLampComponent', () => {
  let component: HueLampComponent;
  let fixture: ComponentFixture<HueLampComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HueLampComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HueLampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
