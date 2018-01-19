import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpnpMediaPlayerComponent } from './upnp-media-player.component';

describe('UpnpMediaPlayerComponent', () => {
  let component: UpnpMediaPlayerComponent;
  let fixture: ComponentFixture<UpnpMediaPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpnpMediaPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpnpMediaPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
