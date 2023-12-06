import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IData } from '../interfaces/data.interface';
import { LoadingController } from '@ionic/angular';
import { BehaviorSubject, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  loading = this.loadingCtrl.create({ animated: true, message: 'Lütfen bekleyin...' });

  public temperatures: BehaviorSubject<IData[]> = new BehaviorSubject<IData[]>([]);
  public temperature: BehaviorSubject<IData> = new BehaviorSubject<IData>({ id: 0, createdDate: new Date, moisture: 0, waterTemperature: 0, weatherTemperature: 0 });

  constructor(private loadingCtrl: LoadingController, private http: HttpClient) {
    this.getNow();
    this.getToday();
  }

  async getToday(event: any = null) {
    if (!event) { (await this.loading).present(); }
    this.http.get<IData[]>(`${environment.apiUrl}/v1/data/today`).pipe(catchError(async e => {
      (await this.loading).dismiss();
      throw new Error(e);
    })).subscribe(async (res: IData[]) => { this.temperatures.next(res); (await this.loading).dismiss(); });
  }

  async getNow(event: any = null) {
    if (!event) { (await this.loading).present(); }
    this.http.get<IData>(`${environment.apiUrl}/v1/data`).pipe(catchError(async e => {
      (await this.loading).dismiss();
      throw new Error(e);
    })).subscribe(async (res: IData) => { this.temperature.next(res); (await this.loading).dismiss(); });
  }

  async getAll(start: Date, end: Date) {
    if (!event) { (await this.loading).present(); }
    this.http.get<IData[]>(`${environment.apiUrl}/v1/data/${start.toISOString()}/${end.toISOString()}`).pipe(catchError(async e => {
      (await this.loading).dismiss();
      throw new Error(e);
    })).subscribe(async (res: IData[]) => { this.temperatures.next(res); (await this.loading).dismiss(); });
  }

}
