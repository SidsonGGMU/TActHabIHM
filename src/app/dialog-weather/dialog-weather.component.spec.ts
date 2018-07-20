import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogWeatherComponent } from './dialog-weather.component';

describe('DialogWeatherComponent', () => {
  let component: DialogWeatherComponent;
  let fixture: ComponentFixture<DialogWeatherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogWeatherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogWeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
