import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetawearComponent } from './metawear.component';

describe('MetawearComponent', () => {
  let component: MetawearComponent;
  let fixture: ComponentFixture<MetawearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetawearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetawearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
