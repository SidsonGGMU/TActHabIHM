import { Component, OnInit } from '@angular/core';
import {TacthabService} from '../tacthab.service';
import {DialogConnectComponent} from '../dialog-connect/dialog-connect.component';
import {TranslateService} from '@ngx-translate/core';
import {MatDialogRef} from '@angular/material';
import {Observable} from 'rxjs';
import {BrickJSON} from '../data/Brick';

@Component({
  selector: 'app-dialog-bridge-ble',
  templateUrl: './dialog-bridge-ble.component.html',
  styleUrls: ['./dialog-bridge-ble.component.scss']
})
export class DialogBridgeBleComponent implements OnInit {

  constructor(private tservice: TacthabService,
              private translate: TranslateService,
              private dialogRef: MatDialogRef<DialogConnectComponent>) { }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

  getBLEBridgeLabel(): Observable<string> {
    return this.translate.get("BLEBridge", {
      count: 2
    });
  }

  createBridgeBLE(IP: string, port: string) {
    this.tservice.call({
      brickId: "BridgeFactoryBLE",
      method: "createBridge",
      arguments: [{host: IP, port}]
    });
    this.close();
  }

  getExistingBridges(): BrickJSON[] {
    return this.tservice.getBricks().filter(B => B.types.indexOf("BLEBridge") >= 0 );
  }

}
