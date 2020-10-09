import { Component, OnInit, ViewChild, TemplateRef  } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Service } from '../../models';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DialogService, DialogFactoryService, DialogData } from '../../../modules/dialog';
import { RequestService } from '../../../services';

@Component({
  selector: 'app-service-mgmt',
  templateUrl: './service-mgmt.component.html',
  styleUrls: ['./service-mgmt.component.css']
})
export class ServiceMgmtComponent implements OnInit {

  private enterPoint = 'services/';
  form: FormGroup;
  isInsert: boolean;
  dialog: DialogService;
  operateService: Service;
  @ViewChild('ServiceTemplate')
  ServiceTemplate: TemplateRef<any>;

  @ViewChild('confirmTemplate')
  confirmTemplate: TemplateRef<any>;
  confirmMessage:string;

  dataSource = new MatTableDataSource<any>();
  serviceCount = 0;
  displayedColumns = ['name','duration','price','operation'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private dialogFactoryService: DialogFactoryService,
    private formBuilder: FormBuilder,
    private req: RequestService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: [''],
      duration: [''],
      price: ['']
    });
    this.getServiceList();
  }
  
  private populateServiceFormForInput(service: Service) {
    this.form.setValue({
      "name": service.name,
      "duration": service.duration,
      "price": service.price
    })
  }

  /**
   * CURD functions
   */
  insertService():void{
    this.form.reset()
    this.isInsert = true;
    this.openServiceDialog();
  }

  deleteService(deleteService:Service):void{
    this.operateService = deleteService;
    this.openConfirmDialog(`是否确认删除该项目:${deleteService.name}?`);
  }

  updateExistedService(updateService:Service):void{
    this.isInsert = false;
    this.operateService = updateService;
    this.populateServiceFormForInput(updateService);
    this.openServiceDialog();
  }

  
  getServiceList():void {
    this.req.baseGet(this.enterPoint).subscribe((serviceList) => {
      this.serviceCount = serviceList.length;
      this.dataSource.data = serviceList;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  } 

  

  reset(){
  }

  /**
   * dialog related functions
   */

  openServiceDialog(){
    let title = this.isInsert ? '新增项目' : '修改信息';
    this.openDialog({
      headerText: title,
      template: this.ServiceTemplate
    })
  }

  private openConfirmDialog(msg){
    this.confirmMessage = msg;
    this.openDialog({
      headerText: '确认',
      template: this.confirmTemplate
    })
  }

  save() {
    //todo: call api to save, add loading, then 
    if(this.isInsert){
      //insert
      let newService = this.form.value;
      this.req.basePost(this.enterPoint,newService).subscribe((res)=>this.ngOnInit())
    }else{
      //patch
      this.req.basePatch(this.enterPoint+this.operateService.id+"/",this.form.value)
          .subscribe((data)=>{this.ngOnInit()});
    }
    this.close();
  }

  confirm(){
    this.req.baseDelete(this.enterPoint,this.operateService.id).subscribe(res=>this.ngOnInit());
    this.close();
  }

  close(){
    this.dialog.close();
  }

  private openDialog(dialogData: DialogData): void {
    this.dialog = this.dialogFactoryService.open(dialogData);
  }
}