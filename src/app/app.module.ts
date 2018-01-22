import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {TacthabService} from "./tacthab.service";

import { AppComponent } from './app.component';
import { SocketBusComponent } from './socket-bus/socket-bus.component';
import { UpnpMediaPlayerComponent } from './upnp-media-player/upnp-media-player.component';
import { UpnpMediaExplorerComponent } from './upnp-media-explorer/upnp-media-explorer.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule, MatCardModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatSliderModule,
  MatToolbarModule
} from '@angular/material';
import {TranslateCompiler, TranslateModule} from '@ngx-translate/core';
import {TranslateMessageFormatCompiler} from 'ngx-translate-messageformat-compiler';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {FormsModule} from '@angular/forms';
import { DialogConnectComponent } from './dialog-connect/dialog-connect.component';
import {HttpClientModule} from '@angular/common/http';
import { HueBridgeComponent } from './hue-bridge/hue-bridge.component';
import { HueLampComponent } from './hue-lamp/hue-lamp.component';

@NgModule({
  declarations: [
    AppComponent,
    SocketBusComponent,
    UpnpMediaPlayerComponent,
    UpnpMediaExplorerComponent,
    DialogConnectComponent,
    HueBridgeComponent,
    HueLampComponent
  ],
  entryComponents: [
    DialogConnectComponent, UpnpMediaExplorerComponent
  ],
  imports: [
    BrowserModule, FormsModule, HttpClientModule,
    TranslateModule.forRoot({
      compiler: {
        provide: TranslateCompiler,
        useClass: TranslateMessageFormatCompiler
      }
    }),
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule, MatToolbarModule, MatMenuModule, MatIconModule, MatFormFieldModule, MatInputModule,
    MatSliderModule,
    MatDialogModule, MatCardModule,
    MatButtonModule
  ],
  providers: [TacthabService],
  bootstrap: [AppComponent]
})
export class AppModule { }
