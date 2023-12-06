import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NbDateFnsDateModule } from "@nebular/date-fns";
import { tr } from 'date-fns/locale';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NbDatepickerModule, NbLayoutModule, NbThemeModule } from '@nebular/theme';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    NbThemeModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDateFnsDateModule.forRoot({ parseOptions: { locale: tr }, formatOptions: { locale: tr }, format: 'dd.MM.yyyy' }),
    NbLayoutModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
