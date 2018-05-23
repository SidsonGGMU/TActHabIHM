import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {TacthabService} from '../tacthab.service';
import {BrickEmitterJSON, BrickJSON} from '../data/Brick';
import {MatDialog} from '@angular/material';
import {DialogAppendCcblFromBrickComponent} from '../dialog-append-ccbl-from-brick/dialog-append-ccbl-from-brick.component';
import {BrickCcblRootJSON, BrickCcblRootJSON_channel, BrickCcblRootJSON_emitter, BrickCcblRootJSON_event} from '../brickTypes';

@Component({
  selector: 'app-ccbl-root',
  templateUrl: './ccbl-root.component.html',
  styleUrls: ['./ccbl-root.component.scss']
})
export class CcblRootComponent implements OnInit {

  constructor( private tservice: TacthabService,
               private translate: TranslateService,
               private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  createCcblRoot() {
    this.tservice.call({
      brickId: "BrickCcblRootFactory",
      method: "createCcblRoot",
      arguments: [{name: "CcblRoot", whiteList: []}]
    });
  }

  getCcblRoots(): BrickCcblRootJSON[] {
    return this.tservice.getBricksTyped( "CcblRoot" ) as BrickCcblRootJSON[];
  }

  addChannel(root: BrickJSON) {
    const dialogRef = this.dialog.open(DialogAppendCcblFromBrickComponent, {
      height: '95%',
      width: '95%',
      data: {ccblType: "channel", root}
    });
    dialogRef.afterClosed().subscribe( (res: {brick: BrickJSON, element: BrickEmitterJSON, ccblName: string, initialValue: string}) => {
      console.log("afterClosed =>", res);
      if (res) {
        this.tservice.call({
          brickId: root.id,
          method: "registerChannel",
          arguments: [res.ccblName, {brickId: res.brick.id, channelName: res.element.name, initialValue: res.initialValue}]
        });
      }
    });
  }

  addEmitter(root: BrickJSON) {
    const dialogRef = this.dialog.open(DialogAppendCcblFromBrickComponent, {
      height: '95%',
      width: '95%',
      data: {ccblType: "emitter", root}
    });
    dialogRef.afterClosed().subscribe( (res: {brick: BrickJSON, element: BrickEmitterJSON, ccblName: string}) => {
      console.log("afterClosed =>", res);
      if (res) {
        this.tservice.call({
          brickId: root.id,
          method: "registerEmitter",
          arguments: [res.ccblName, {brickId: res.brick.id, emitterName: res.element.name}]
        });
      }
    });
  }

  getEmitters(root: BrickCcblRootJSON): BrickCcblRootJSON_emitter[] {
    return root.env.emitters;
  }

  getChannels(root: BrickCcblRootJSON): BrickCcblRootJSON_channel[] {
    return root.env.channels;
  }

  getEventers(root: BrickCcblRootJSON): BrickCcblRootJSON_event[] {
    return root.env.events;
  }

}





