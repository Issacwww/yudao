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

  public members : Member[] = [];
  tHead = ['会员卡号','会员姓名','会员性别','联系方式','办理日期','当前余额','操作'];
  genders = [{value:true, label:'男宾'},{value:false, label:'女宾'}];
  form: FormGroup;
  mode: boolean;
  query: string = '';
  operateMemberId: Number;
  dialog: DialogService;
  @ViewChild('addNewMemberTemplate')
  addNewMemberTemplate: TemplateRef<any>;

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
  close(){
    this.dialog.close();
    this.form.reset();
    this.form.patchValue({"gender":true});
  }
  save() {
    //todo: call api to save, add loading, then 
    if(this.mode){
      //insert
      let newMember = this.form.value;
      newMember['open_date'] = this.date.today();
      this.req.basePost('members/',newMember).subscribe((res)=>window.location.reload())
    }else{
      //patch
      this.req.basePatch('members/'+this.operateMemberId+"/",{
        name: this.form.value.name,
        phone: this.form.value.phone
      }).subscribe((data)=>{
        console.log(data);
        window.location.reload();
      });
    }
    this.close();
    //refresh
    
  }

  private openDialog(dialogData: DialogData): void {
    this.dialog = this.dialogFactoryService.open(dialogData);
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
  getAllMembers():void {
    this.req.baseGet('members/').subscribe(memberList => {
      this.members = memberList as Member[];
      this.storage.set('members', this.members);
    })
  } 

  insertMember():void{
    this.toggleMemberDialog(0);
  }

  updateExistedMember(updateMember:Member):void{
    this.operateMemberId = updateMember.id;
    this.populateMemberFormForInput(updateMember);
    this.toggleMemberDialog(1);
    console.log(updateMember);
  }

  topUpForExistedMember(updateMember:Member):void{
    this.operateMemberId = updateMember.id;
  }

  deleteMember(id:number):void{

  }

  search(){
    this.members = this.filter.processQuery(this.storage.get('members'), "card_number", this.query);
  }

  reset(){
    this.members = this.storage.get('members');
  }

}
