import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PipoComponent } from './pipo.component';

describe('PipoComponent', () => {
  let component: PipoComponent;
  let fixture: ComponentFixture<PipoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PipoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
