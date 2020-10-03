import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.css']
})
export class FinanceComponent implements OnInit {
  activeIdx = 0
  navLinks = [
    {
      link:'order',
      label:'订单记录',
    },
    {
      link:'topup',
      label:'充值记录',
    },
    {
      link:'spending',
      label:'支出记录',
    }
  ]
  constructor(private router: Router) { }

  ngOnInit(){
    let path = this.router.url.split('/')[3];
    let idx = 0;
    for(;idx < this.navLinks.length; idx++){
      if(this.navLinks[idx].link === path){
        this.activeIdx = idx;
        break;
      }
    }
  }

  changeTab(idx){
    this.activeIdx = idx;
    this.router.navigateByUrl('/dashboard/finance/'+this.navLinks[idx].link);
  }
}
