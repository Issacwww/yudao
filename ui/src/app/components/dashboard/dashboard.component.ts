import { Component, OnInit} from '@angular/core';
import { Router} from '@angular/router';
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
      name:'玉道采耳'
    },
    {
      path:'/serve',
      name:'上钟管理'
    },
    {
      path:'/members',
      name:'会员管理'
    },
    {
      path:'/crew',
      name:'技师管理'
    },
    {
      path:'/services',
      name:'项目管理'
    },
    {
      path:'/rooms',
      name:'客房管理'
    },
    {
      path:'/finance',
      name:'收支管理'
    },
    {
      path:'/statistic',
      name:'财务统计'
    }
  ]

  constructor(public router: Router) { }

  ngOnInit(): void {
    let path = "/"+this.router.url.split('/')[2];
    let idx = 0;
    for(;idx < this.navItems.length; idx++){
      if(this.navItems[idx].path === path){
        this.selectedItem = idx;
        break;
      }
    }
  }

  changeTab(idx: number){
    this.selectedItem = idx;
    this.router.navigateByUrl('dashboard'+this.navItems[idx].path)
  }
}
