import { Component, OnInit } from '@angular/core';
import { DateService, RequestService } from 'src/app/services';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label,MultiDataSet } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css']
})
export class StatisticComponent implements OnInit {

  private enterPoint = 'statistics';
  links=['收支统计','员工绩效'];
  activeLink = this.links[0];
  start=this.date.firstOfMonth();
  end=this.date.today(false);

  barChartOptions: ChartOptions = {
    title:{
      text:`${this.start} - ${this.end} 收支统计图`,
      fontSize:14,
      display:true
    },
    responsive: true,
    cutoutPercentage: 0.5
  };
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [pluginDataLabels];

  doughnutChartPlugins = [];
  doughnutChartOptions: ChartOptions = {
    title:{
      text:`${this.start} - ${this.end} 营收构成图`,
      fontSize: 14,
      display:true
    },
    responsive: true,
  };
  doughnutChartType: ChartType = 'doughnut';

  barChartLabels: Label[] = ['收支统计'];
  barChartData: ChartDataSets[] = [
    {data:[], label:'日常开支'},
    {data:[], label:'营业总额'}
  ];

  doughnutChartLabels: Label[] = [];
  doughnutChartData: MultiDataSet = [[0,0,0],[0,0,0]];
  
  constructor(
    private date: DateService,
    private req: RequestService
  ) { }

  ngOnInit(): void {
    this.getDateByDate();
    
  }

  changeTab(idx){
    this.activeLink = this.links[idx];
  }

  getDateByDate(){
    this.req.getWithBody(this.enterPoint,{
      start:this.start,
      end:this.end
    }).subscribe(response =>{
      this.drawBarChart([response['expense'],response['turnover']]);
      this.doughnutChart([response['member_orders'],response['non_member_orders'],response['online_orders']]);
      
    })
  }

  private drawBarChart(data){
    this.barChartData[0].data.push(data[0]['total']);
    this.barChartData[1].data.push(data[1]['total']);
  }

  private doughnutChart(data){
    //income and expense
    let totalData = [], countData = [];
    data.forEach(item=>{
      this.doughnutChartLabels.push(item['label']);
      totalData.push(item['total'])
      countData.push(item['counts']);
    });
    this.doughnutChartData = [totalData,countData];
  }
  
}
