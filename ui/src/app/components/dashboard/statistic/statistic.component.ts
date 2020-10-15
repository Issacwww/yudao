import { Component, OnInit } from '@angular/core';
import { DateService } from 'src/app/services';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css']
})
export class StatisticComponent implements OnInit {

  links=['收支统计','员工绩效'];
  activeLink = this.links[0];
  start=this.date.firstOfMonth();
  end=this.date.today(false);
  constructor(private date: DateService) { }

  ngOnInit(): void {
  }

  changeTab(idx){
    this.activeLink = this.links[idx];
  }
}
