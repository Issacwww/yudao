import { Component, OnInit, ViewChild, TemplateRef  } from '@angular/core';
import { Service } from './service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DialogService, DialogFactoryService, DialogData } from '../../../modules/dialog';
import { RequestService, DateService, FilterService, StorageService} from '../../../services';

@Component({
  selector: 'app-service-mgmt',
  templateUrl: './service-mgmt.component.html',
  styleUrls: ['./service-mgmt.component.css']
})
export class ServiceMgmtComponent implements OnInit {

  private enterPoint = 'services/';
  public services : Service[] = [];
  tHead = ['项目名称','项目时长','项目价格','操作'];
  form: FormGroup;
  isInsert: boolean;
  query: string = '';
  dialog: DialogService;
  hasService: boolean;
  operateService: Service;
  @ViewChild('ServiceTemplate')
  ServiceTemplate: TemplateRef<any>;

  @ViewChild('confirmTemplate')
  confirmTemplate: TemplateRef<any>;
  confirmMessage:string;

  constructor(
    private dialogFactoryService: DialogFactoryService,
    private formBuilder: FormBuilder,
    private req: RequestService,
    private date: DateService,
    private filter: FilterService,
    private storage: StorageService
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
      this.services = serviceList as Service[];
      this.services.sort((a, b) => a.id < b.id ? -1 : 1)
      this.storage.set('services', this.services);
      this.hasService = serviceList.length > 0;
    })
  } 

  search(){
    this.services = this.filter.processQuery(this.storage.get('services'), "", this.query);
    this.query = '';
  }

  reset(){
    this.query = '';
    this.services = this.storage.get('services');
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
      let newMember = this.form.value;
      newMember['open_date'] = this.date.today();
      this.req.basePost(this.enterPoint,newMember).subscribe((res)=>this.ngOnInit())
    }else{
      //patch
      this.req.basePatch(this.enterPoint+this.operateService.id+"/",this.form.value)
          .subscribe((data)=>{this.ngOnInit()});
    }
    this.close();
    this.form.reset();
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
