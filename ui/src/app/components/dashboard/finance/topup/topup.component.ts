import { Component, OnInit } from '@angular/core';
import { TopUpRecord } from './touup-record';
import { RequestService,StorageService } from 'src/app/services';

@Component({
  selector: 'app-topup',
  templateUrl: './topup.component.html',
  styleUrls: ['./topup.component.css']
})
export class TopupComponent implements OnInit {

  enterPoint='topup'
  topUpRecords = [];
  tHead = ['充值订单编号','会员信息','充值日期','充值金额']
  constructor(
    private req: RequestService,
    private storage: StorageService
  ) { }

  ngOnInit(): void {
    this.getAllTopUpRecords();
  }

  getAllTopUpRecords(){
    this.req.baseGet(this.enterPoint).subscribe(topUpRecordsList => {
      this.topUpRecords = topUpRecordsList as TopUpRecord[];
      this.topUpRecords.sort((a, b) => a.spend_date > b.spend_date ? -1 : 1)
      this.storage.set('topUpRecords', this.topUpRecords);
    })
  }
}
