import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocketBusComponent } from './socket-bus.component';

describe('SocketBusComponent', () => {
  let component: SocketBusComponent;
  let fixture: ComponentFixture<SocketBusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocketBusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocketBusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
