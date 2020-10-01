import { Component, OnInit, ViewChild, TemplateRef  } from '@angular/core';
import { Crew } from './crew';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DialogService, DialogFactoryService, DialogData } from '../../../modules/dialog';
import { RequestService, DateService, FilterService, StorageService} from '../../../services';

@Component({
  selector: 'app-crew-mgmt',
  templateUrl: './crew-mgmt.component.html',
  styleUrls: ['./crew-mgmt.component.css']
})
export class CrewMgmtComponent implements OnInit {

  private enterPoint = 'crew/';
  public crew : Crew[] = [];
  tHead = ['技师工号','技师姓名','技师性别','身份证号','联系方式','入职日期','操作'];
  genders = [{value:true, label:'男技师'},{value:false, label:'女技师'}];
  form: FormGroup;
  isInsert: boolean;
  query: string = '';
  topUpAmount: number;
  operateStaff: Crew;
  hasCrew = false;

  dialog: DialogService;
  @ViewChild('addNewStaffTemplate')
  addNewStaffTemplate: TemplateRef<any>;

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
      national_id: [''],
      phone: [''],
      crew_number: ['']
    });
    this.getCrew();
  }
  
  private populateMemberFormForInput(staff: Crew) {
    this.form.setValue({
      "name": staff.name,
      "gender": staff.gender,
      "national_id":staff.national_id,
      "phone": staff.phone,
      "crew_number": staff.crew_number,
    })
  }

  /**
   * CURD functions
   */
  insertStaff():void{
    this.isInsert = true;
    this.openStaffDialog();
  }

  deleteStaff(deleteStaff:Crew):void{
    this.operateStaff = deleteStaff;
    this.confirmMessage = `是否确认删除该技师:${deleteStaff.name}?`;
    this.openConfirmDialog();
  }

  updateHiredStaff(updateStaff:Crew):void{
    this.isInsert = false;
    this.operateStaff = updateStaff;
    this.populateMemberFormForInput(updateStaff);
    this.openStaffDialog();
  }

  getCrew():void {
    this.req.baseGet(this.enterPoint).subscribe(crewList => {
      this.crew = crewList as Crew[];
      this.crew.sort((a, b) => a.crew_number < b.crew_number ? -1 : 1)
      this.storage.set('crew', this.crew);
      this.hasCrew = crewList.length > 0;
    })
  } 

  search(){
    this.crew = this.filter.processQuery(this.storage.get('crew'), "crew_number", this.query);
    this.query = '';
  }

  reset(){
    this.query = '';
    this.crew = this.storage.get('crew');
  }

  /**
   * dialog related functions
   */

  openStaffDialog(){
    let title =  this.isInsert ? '新增技师' : '修改信息';
    this.openDialog({
      headerText: title,
      template: this.addNewStaffTemplate
    });
  }

  openConfirmDialog(){
    this.openDialog({
      headerText: '',
      template: this.confirmTemplate
    })
  }

  save() {
    //todo: call api to save, add loading, then 
    if(this.isInsert){
      //insert
      let newStaff = this.form.value;
      newStaff['hire_date'] = this.date.today();
      this.req.basePost(this.enterPoint,newStaff).subscribe((res)=>this.ngOnInit())
    }else{
      //patch
      this.req.basePatch(this.enterPoint+this.operateStaff.id+"/",{
        name: this.form.value.name,
        phone: this.form.value.phone
      }).subscribe((data)=>{
        console.log(data);
        this.ngOnInit();
      });
    }
    this.close();
    this.form.reset();
    this.form.patchValue({"gender":true});
  }

  confirm(){
    //do delete
    this.req.baseDelete(this.enterPoint,this.operateStaff.id).subscribe(res=>this.ngOnInit());
    this.close();
  }

  close(){
    this.dialog.close();
  }

  private openDialog(dialogData: DialogData): void {
    this.dialog = this.dialogFactoryService.open(dialogData);
  }
}
