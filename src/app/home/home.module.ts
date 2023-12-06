import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { environment } from '../../environments/environment';
import { NgxGaugeModule } from 'ngx-gauge';
import { NgxEchartsModule } from 'ngx-echarts';
import { NbButtonModule, NbCardModule, NbDatepickerModule, NbInputModule } from '@nebular/theme';


const config: SocketIoConfig = { url: environment.apiUrl, options: { transports: ['websocket'] } };

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    NbDatepickerModule,
    NbButtonModule,
    NbCardModule,
    NbInputModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    SocketIoModule.forRoot(config),
    NgxGaugeModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
