import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public selectedItem = 0;
  public navItems = [
    {
      path:'',
      name:'上钟管理'
    },
    {
      path:'',
      name:'会员管理'
    },
    {
      path:'',
      name:'技师管理'
    },
    {
      path:'',
      name:'项目管理'
    },
    {
      path:'',
      name:'客房管理'
    },
    {
      path:'',
      name:'日常开支'
    },
    {
      path:'',
      name:'财务统计'
    }
  ]
  constructor() { }

  ngOnInit(): void {

  }

}
