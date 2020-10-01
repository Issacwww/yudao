import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Member } from './member';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DialogService, DialogFactoryService, DialogData } from '../../../modules/dialog';
import { RequestService, DateService, FilterService, StorageService} from '../../../services';
@Component({
  selector: 'app-member-mgmt',
  templateUrl: './member-mgmt.component.html',
  styleUrls: ['./member-mgmt.component.css']
})
export class MemberMgmtComponent implements OnInit {

  private enterPoint = 'members/';
  public members : Member[] = [];
  tHead = ['会员卡号','会员姓名','会员性别','联系方式','办理日期','当前余额','操作'];
  genders = [{value:true, label:'男宾'},{value:false, label:'女宾'}];
  form: FormGroup;
  mode: boolean;
  query: string = '';
  topUpAmount: number;
  operateMember: Member;
  isTopUp: boolean = false;
  hasMember = false;
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
    this.getAllMembers();
  }
  
  private populateMemberFormForInput(member: Member) {
    this.form.setValue({
      "name": member.name,
      "gender": member.gender,
      "phone": member.phone,
      "card_number": member.card_number,
      "balance": member.balance
    })
  }

  /**
   * CURD functions
   */
  insertMember():void{
    this.toggleMemberDialog(0);
  }

  deleteMember(deleteMember:Member):void{
    this.isTopUp = false;
    this.operateMember = deleteMember;
    this.openConfirmDialog(`是否确认删除会员:${deleteMember.name}?`);
  }

  updateExistedMember(updateMember:Member):void{
    this.operateMember = updateMember;
    this.populateMemberFormForInput(updateMember);
    this.toggleMemberDialog(1);
  }

  topUpForExistedMember(topUpMember:Member):void{
    this.isTopUp = true;
    this.operateMember = topUpMember;
    this.confirmMessage = `确认为会员${topUpMember.name}充值`;
    this.openTopUpDialog(topUpMember);
    
  }

  getAllMembers():void {
    this.req.baseGet(this.enterPoint).subscribe(memberList => {
      this.members = memberList as Member[];
      this.members.sort((a, b) => a.card_number < b.card_number ? -1 : 1)
      this.storage.set('members', this.members);
      this.hasMember = memberList.length > 0;
    })
  } 

  search(){
    this.members = this.filter.processQuery(this.storage.get('members'), "card_number", this.query);
    this.query = '';
  }

  reset(){
    this.query = '';
    this.members = this.storage.get('members');
  }

  /**
   * dialog related functions
   */
  private toggleMemberDialog(mode):void{
    this.mode = mode === 0;
    let title =  this.mode ? '新增会员' : '修改信息';
    this.openDialog({
      headerText: title,
      template: this.addNewMemberTemplate
    });
  }
  
  private openDialog(dialogData: DialogData): void {
    this.dialog = this.dialogFactoryService.open(dialogData);
  }

  openTopUpDialog(topUpMember:Member){
    this.openDialog({
      headerText:"会员充值",
      template:this.topUpTemplate
    })
  }

  openConfirmDialog(msg:string){
    this.openDialog({
      headerText:"",
      template:this.confirmTemplate
    })
    this.confirmMessage = msg;
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
      this.req.basePatch(this.enterPoint+this.operateMember.id+"/",{
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

  topUp(){
    this.confirmMessage += `${this.topUpAmount}元?`;
    this.dialog.setTemplate(this.confirmTemplate);
  }

  confirm(){
    console.log(this.confirmMessage);
    if(this.isTopUp){
      // todo: one more records should be created in the topUp table.
      this.req.basePatch(this.enterPoint+this.operateMember.id+"/",{
        balance:+this.operateMember.balance + +this.topUpAmount
      }).subscribe((data)=>{
        this.req.basePost("topup/",{
          member: this.operateMember.id,
          amount: +this.topUpAmount,
          topup_date: this.date.today()
        }).subscribe((data)=>{
          window.location.reload();
        })
      });
    }else{
      //do delete
      this.req.baseDelete(this.enterPoint,this.operateMember.id).subscribe(res=>window.location.reload());
    }
    this.close();
  }

  close(){
    this.dialog.close();
  }

}
