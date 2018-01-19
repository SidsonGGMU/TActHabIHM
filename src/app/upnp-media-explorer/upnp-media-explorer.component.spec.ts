import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpnpMediaExplorerComponent } from './upnp-media-explorer.component';

describe('UpnpMediaExplorerComponent', () => {
  let component: UpnpMediaExplorerComponent;
  let fixture: ComponentFixture<UpnpMediaExplorerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpnpMediaExplorerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpnpMediaExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
