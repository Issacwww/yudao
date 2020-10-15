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
  links=['会员订单','非会员订单','线上订单','当日统计'];
  activeLink = this.links[0];
  memberOrders = [];
  nonMemberOrders = [];
  onlineOrders = [];
  orderCount = 0;
  dataSource = new MatTableDataSource<Order>();
  displayedColumns = new Set(['id','service','staff','room','consumption','order_date','member_info']);
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private req: RequestService,
  ) { }

  ngOnInit(): void {
    this.getAllOrders();
    
  }

  getAllOrders(){
    this.req.baseGet(this.enterPoint).subscribe(response => {
      this.memberOrders = response['member_orders'] as Order[];
      this.nonMemberOrders = response['non_member_orders'] as Order[];
      this.onlineOrders = response['online_orders'] as Order[];
      this.orderCount = this.memberOrders.length + this.nonMemberOrders.length + this.onlineOrders.length;
      
      this.dataSource.data = this.memberOrders;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }

  changeTab(idx){
    this.activeLink = this.links[idx];
    if(idx === 0){
      this.displayedColumns.add('member_info');
      this.displayedColumns.delete('order_source');
      this.dataSource.data = this.memberOrders;
    }else if(idx === 1){
      this.displayedColumns.delete('member_info');
      this.displayedColumns.delete('order_source');
      this.dataSource.data = this.nonMemberOrders;
    }else if(idx === 2){
      this.displayedColumns.delete('member_info');
      this.displayedColumns.add('order_source');
      this.dataSource.data = this.onlineOrders;
    }
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }


}

