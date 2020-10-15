import { Component, OnInit, ViewChild } from '@angular/core';
import { RequestService } from 'src/app/services';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Order } from '../../../models';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  enterPoint='orders'
  isMemberOrder=false;
  links=['会员订单','非会员订单'];
  activeLink = this.links[0];
  memberOrders = [];
  nonMemberOrders = []
  orderCount = 0;
  dataSource = new MatTableDataSource<Order>();
  displayedColumns = ['id','service','staff','room','consumption','order_date','member_info']
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private req: RequestService,
  ) { }

  ngOnInit(): void {
    this.getAllOrders();
    
  }

  getAllOrders(){
    this.req.baseGet(this.enterPoint).subscribe(orderList => {
      this.orderCount = orderList.length;
      (orderList as Order[]).forEach(order=>{
        if(order.member_info){
          this.memberOrders.push(order);
        }else{
          this.nonMemberOrders.push(order);
        }
      });
      this.dataSource.data = this.memberOrders;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }

  changeTab(idx){
    this.activeLink = this.links[idx];
    if(idx === 0){
      if(!this.displayedColumns.includes('member_info'))
        this.displayedColumns.push('member_info');
      this.dataSource.data = this.memberOrders;
    }else{
      if(this.displayedColumns.includes('member_info'))
        this.displayedColumns.pop();
      this.dataSource.data = this.nonMemberOrders;
    }
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }


}

