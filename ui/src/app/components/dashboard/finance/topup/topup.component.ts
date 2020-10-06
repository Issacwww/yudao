import { Component, OnInit, ViewChild } from '@angular/core';
import { RequestService } from 'src/app/services';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-topup',
  templateUrl: './topup.component.html',
  styleUrls: ['./topup.component.css']
})
export class TopupComponent implements OnInit {

  enterPoint='topUp'
  topUpCount = 0;
  topUpRecords = new MatTableDataSource<TopUpRecord>();
  displayedColumns = ['id','member','topup_date','amount']
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private req: RequestService,
  ) { }

  ngOnInit(): void {
    this.getAllTopUpRecords();
  }

  getAllTopUpRecords(){
    this.req.baseGet(this.enterPoint).subscribe(topUpRecordsList => {
      this.topUpCount = topUpRecordsList.length;
      this.topUpRecords.data = topUpRecordsList;
      this.topUpRecords.sort = this.sort;
      this.topUpRecords.paginator = this.paginator;
    })
  }
}

export interface TopUpRecord{
  id:number;
  member:string;
  topup_date:Date;
  amount:number;
}
