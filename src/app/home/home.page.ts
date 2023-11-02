import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { IData } from '../common/interfaces/data.interface';
import { DataService } from '../common/services/data.service';
import { EChartsOption } from 'echarts';
import { Colors } from '../common/colors/color';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  lastData: IData = {
    createdDate: new Date(),
    id: 0,
    moisture: 0,
    waterTemperature: 0,
    weatherTemperature: 0
  }

  datas: IData[] = [];

  dates: { start: Date, end: Date } = { start: new Date(new Date().setHours(0, 0, 0, 0)), end: new Date() };

  chartOption: EChartsOption = {
    color: [Colors.colors.warningLight, Colors.colors.infoLight, Colors.colors.dangerLight, Colors.colors.successLight, Colors.colors.primaryLight],
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ["Su Sıcaklığı", "Nem", "Sera Sıcaklığı"],
      textStyle: {
        color: Colors.echartsColor.textColor,
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    yAxis: [
      {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: Colors.echartsColor.axisLineColor,
          },
        },
        splitLine: {
          lineStyle: {
            color: Colors.echartsColor.splitLineColor,
          },
        },
        axisLabel: {
          color: Colors.echartsColor.textColor
        },
      },
    ]
  };

  constructor(private socket: Socket, private dataService: DataService) {
    this.dataService.datas.asObservable().subscribe(res => {
      this.datas = res;
      if (res.length > 0) {
        this.lastData = res[res.length - 1];
        this.chartOption.xAxis = {
          type: 'category',
          boundaryGap: false,
          data: this.datas.map(el => { return new Date(el.createdDate).toLocaleString() }),
          axisTick: {
            alignWithLabel: true,
          },
          axisLine: {
            lineStyle: {
              color: Colors.echartsColor.axisLineColor,
            },
          },
          axisLabel: {
            color: Colors.echartsColor.textColor
          },
        }
        this.chartOption.series = [
          {
            name: 'Su Sıcaklığı',
            type: 'line',
            smooth: true,
            // areaStyle: {
            //   opacity: Colors.echartsColor.areaOpacity
            // },
            data: this.datas.map(el => { return el.waterTemperature }),
          },
          {
            name: 'Nem',
            type: 'line',
            smooth: true,
            // areaStyle: {
            //   opacity: Colors.echartsColor.areaOpacity
            // },
            data: this.datas.map(el => { return el.moisture }),
          },
          {
            name: 'Sera Sıcaklığı',
            type: 'line',
            smooth: true,
            // areaStyle: {
            //   opacity: Colors.echartsColor.areaOpacity
            // },
            data: this.datas.map(el => { return el.weatherTemperature }),
          }
        ];
        this.chartOption.dataZoom = [
          {
            type: 'inside',
            xAxisIndex: [0],
            start: 1
          }
        ]
        // this.chartOption.series = [
        //   {
        //     type: 'line',
        //     data: this.datas.map(el => { return { name: 'Nem', value: el.moisture } })
        //   }
        // ]
      }
    });
    this.socket.on('data', (res: IData) => { this.newData(res) });
    this.socket.emit('join', { test: 'eren' });
  }


  async newData(data: IData) {
    this.lastData = data;
  }

  ngOnInit() {
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
    }, 2000);
  }

}
