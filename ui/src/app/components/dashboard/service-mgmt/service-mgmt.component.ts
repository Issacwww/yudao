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

  private enterPoint = 'members/';
  public services : Service[] = [];
  tHead = ['会员卡号','会员姓名','会员性别','联系方式','办理日期','当前余额','操作'];
  genders = [{value:true, label:'男宾'},{value:false, label:'女宾'}];
  form: FormGroup;
  mode: boolean;
  query: string = '';
  topUpAmount: number;
  isTopUp: boolean = false;
  dialog: DialogService;
  @ViewChild('addNewMemberTemplate')
  addNewMemberTemplate: TemplateRef<any>;

  @ViewChild('topUpTemplate')
  topUpTemplate: TemplateRef<any>;

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
      gender: [true],
      phone: [''],
      card_number: [''],
      balance: []
    });
    this.getCrew();
  }
  
  private populateMemberFormForInput(service: Service) {
    this.form.setValue({
      "name": service.name,
      "duration": service.duration,
      "price": service.price
    })
  }

  /**
   * CURD functions
   */
  insertMember():void{
  }

  deleteMember(deleteMember:Service):void{
    this.isTopUp = false;
    this.openConfirmDialog(`是否确认删除该技师:${deleteMember.name}?`);
  }

  updateExistedMember(updateMember:Service):void{
    this.populateMemberFormForInput(updateMember);
    this.toggleMemberDialog(1);
  }

  
  getCrew():void {
   
  } 

  search(){
    this.services = this.filter.processQuery(this.storage.get('crew'), "card_number", this.query);
    this.query = '';
  }

  reset(){
    this.query = '';
    this.services = this.storage.get('crew');
  }

  /**
   * dialog related functions
   */

  toggleMemberDialog(mode){

  }

  openConfirmDialog(msg:String){

  }

  save() {
    //todo: call api to save, add loading, then 
    if(this.mode){
      //insert
      let newMember = this.form.value;
      newMember['open_date'] = this.date.today();
      this.req.basePost(this.enterPoint,newMember).subscribe((res)=>window.location.reload())
    }else{
      //patch
      this.req.basePatch(this.enterPoint+"/",{
        name: this.form.value.name,
        phone: this.form.value.phone
      }).subscribe((data)=>{
        console.log(data);
        window.location.reload();
      });
    }
    this.close();
    this.form.reset();
    this.form.patchValue({"gender":true});
  }


  close(){
    this.dialog.close();
  }
}
