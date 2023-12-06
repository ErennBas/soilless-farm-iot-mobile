import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { IData } from '../common/interfaces/data.interface';
import { DataService } from '../common/services/data.service';
import { EChartsOption } from 'echarts';
import { Colors } from '../common/colors/color';
import { NbDateService } from '@nebular/theme';


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
  today: Date = new Date(new Date().setDate(new Date().getDate() + 1))

  temperatures: IData[] = [];
  temperature: IData = { id: 0, createdDate: new Date, moisture: 0, waterTemperature: 0, weatherTemperature: 0 };

  range: any;
  echartsInstance: any;

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
    this.dataService.temperature.asObservable().subscribe(res => {
      this.temperature = res;
    });
    this.dataService.temperatures.asObservable().subscribe(res => {
      this.temperatures = res;
      this.updateChart();
    });
    this.socket.on('data', (res: IData) => { this.newData(res) });
    this.socket.emit('join', { test: 'eren' });
  }


  async newData(data: IData) {
    this.temperature = data;
    this.temperatures.push(this.temperature);
    this.updateChart();
  }

  ngOnInit() {
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
    }, 2000);
  }

  rangeChange(e: any) {
    if (e.start && e.end) {
      this.dataService.getAll(new Date(new Date(e.start).setHours(0,0,0,0)), new Date(new Date(e.end).setHours(23,59,59,0)));
    }
  }

  onChartInit(ec: any) {
    this.echartsInstance = ec;
  }

  updateChart() {
    this.chartOption.xAxis = {
      type: 'category',
      boundaryGap: false,
      data: this.temperatures.map(el => { return new Date(el.createdDate).toLocaleString() }),
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
        data: this.temperatures.map(el => { return el.waterTemperature }),
      },
      {
        name: 'Nem',
        type: 'line',
        smooth: true,
        // areaStyle: {
        //   opacity: Colors.echartsColor.areaOpacity
        // },
        data: this.temperatures.map(el => { return el.moisture }),
      },
      {
        name: 'Sera Sıcaklığı',
        type: 'line',
        smooth: true,
        // areaStyle: {
        //   opacity: Colors.echartsColor.areaOpacity
        // },
        data: this.temperatures.map(el => { return el.weatherTemperature }),
      }
    ];
    this.chartOption.dataZoom = [
      {
        type: 'inside',
        xAxisIndex: [0],
        start: 1
      }
    ];
    if (this.echartsInstance) {
      this.echartsInstance.setOption(this.chartOption);
    }
  }

}
