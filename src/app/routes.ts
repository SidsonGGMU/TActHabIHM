import {DevicesComponent} from './devices/devices.component';
import {CcblRootComponent} from './ccbl-root/ccbl-root.component';
import {Route} from '@angular/router';

export const appRoutes: Route[] = [
  { path: 'devices'   , component: DevicesComponent  },
  { path: 'ccbl-root' , component: CcblRootComponent },
  { path: '',
    redirectTo: '/devices',
    pathMatch: 'full'
  }
];
