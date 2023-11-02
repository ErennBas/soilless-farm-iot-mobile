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

  public datas: BehaviorSubject<IData[]> = new BehaviorSubject<IData[]>([]);
  public data: BehaviorSubject<IData> = new BehaviorSubject<IData>({ id: 0, createdDate: new Date, moisture: 0, waterTemperature: 0, weatherTemperature: 0 });

  constructor(private loadingCtrl: LoadingController, private http: HttpClient) {
    // this.getToday();
    this.getAll(new Date("01.08.2023"), new Date());
  }

  async getToday(event: any = null) {
    if (!event) { (await this.loading).present(); }
    this.http.get<IData[]>(`${environment.apiUrl}/v1/data/today`).pipe(catchError(async e => {
      (await this.loading).dismiss();
      throw new Error(e);
    })).subscribe(async (res: IData[]) => { this.datas.next(res); (await this.loading).dismiss(); });
  }

  async getAll(start: Date, end: Date) {
    if (!event) { (await this.loading).present(); }
    this.http.get<IData[]>(`${environment.apiUrl}/v1/data/${start.toISOString()}/${end.toISOString()}`).pipe(catchError(async e => {
      (await this.loading).dismiss();
      throw new Error(e);
    })).subscribe(async (res: IData[]) => { this.datas.next(res); (await this.loading).dismiss(); });
  }

}
