import { Component, OnInit, ViewChild, TemplateRef  } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Crew } from '../../models';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { DialogService, DialogFactoryService, DialogData } from '../../../modules/dialog';
import { RequestService, DateService, FilterService, StorageService} from '../../../services';

@Component({
  selector: 'app-crew-mgmt',
  templateUrl: './crew-mgmt.component.html',
  styleUrls: ['./crew-mgmt.component.css']
})
export class CrewMgmtComponent implements OnInit {

  private enterPoint = 'crew/';
  dataSource = new MatTableDataSource<any>();
  crewCount = 0;
  displayedColumns = ['crew_number','name','gender','national_id','phone','hire_date','operation'];
  genders = [{value:true, label:'男技师'},{value:false, label:'女技师'}];
  displayGender = (flag) => flag ? '男技师' : '女技师';
  form: FormGroup;
  isInsert: boolean;
  operateStaff: Crew;
  hasCrew = false;

  dialog: DialogService;
  @ViewChild('addNewStaffTemplate')
  addNewStaffTemplate: TemplateRef<any>;

  @ViewChild('confirmTemplate')
  confirmTemplate: TemplateRef<any>;
  confirmMessage:string;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

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
  
  private populateStaffFormForInput(staff: Crew) {
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
    this.form.reset();
    this.form.patchValue({'gender':true});
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
    this.populateStaffFormForInput(updateStaff);
    this.openStaffDialog();
  }

  getCrew():void {
    this.req.baseGet(this.enterPoint).subscribe(crewList => {
      this.crewCount = crewList.length;
      this.dataSource.data = crewList;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  } 


  reset(){
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
      newStaff['hire_date'] = this.date.today(false);
      this.req.basePost(this.enterPoint,newStaff).subscribe((res)=>this.ngOnInit())
    }else{
      //patch
      this.req.basePatch(this.enterPoint+this.operateStaff.id+"/",{
        name: this.form.value.name,
        phone: this.form.value.phone
      }).subscribe((data)=>{this.ngOnInit();});
    }
    this.close();
  }

  confirm(){
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
