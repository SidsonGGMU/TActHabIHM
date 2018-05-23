import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CcblRootComponent } from './ccbl-root.component';

describe('CcblRootComponent', () => {
  let component: CcblRootComponent;
  let fixture: ComponentFixture<CcblRootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CcblRootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CcblRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
