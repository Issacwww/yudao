import { Component, OnInit,ViewChild, TemplateRef  } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DialogService, DialogFactoryService, DialogData } from '../../../modules/dialog';
import { RequestService } from '../../../services';

@Component({
  selector: 'app-rooms',
  templateUrl: './room-mgmt.component.html',
  styleUrls: ['./room-mgmt.component.css']
})
export class RoomMgmtComponent implements OnInit {

  private enterPoint = 'rooms/';
  dataSource = new MatTableDataSource<any>();
  roomCount = 0;
  displayedColumns = ['id', 'name','bed_count','operation'];
  form: FormGroup;
  isInsert: boolean;
  operateRoom: Room;
  hasRoom = false;

  dialog: DialogService;
  @ViewChild('addNewRoomTemplate')
  addNewRoomTemplate: TemplateRef<any>;

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
      bed_count:['']
    });
    this.getCrew();
  }
  
  private populateStaffFormForInput(room: Room) {
    this.form.setValue({
      "name": room.name,
      "bed_count": room.bed_count,
    })
  }

  /**
   * CURD functions
   */
  insertRoom():void{
    this.form.reset();
    this.isInsert = true;
    this.openStaffDialog();
  }

  updateRoom(updateRoom:Room):void{
    this.isInsert = false;
    this.operateRoom = updateRoom;
    this.populateStaffFormForInput(updateRoom);
    this.openStaffDialog();
  }

  getCrew():void {
    this.req.baseGet(this.enterPoint).subscribe(roomList => {
      this.roomCount = roomList.length;
      this.dataSource.data = roomList;
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
    let title =  this.isInsert ? '新增房间' : '修改信息';
    this.openDialog({
      headerText: title,
      template: this.addNewRoomTemplate
    });
  }

  save() {
    //todo: call api to save, add loading, then 
    if(this.isInsert){
      //insert
      this.req.basePost(this.enterPoint,this.form.value).subscribe((res)=>this.ngOnInit())
    }else{
      //patch
      this.req.basePatch(this.enterPoint+this.operateRoom.id+"/",this.form.value).subscribe((data)=>{this.ngOnInit();});
    }
    this.close();
  }

  close(){
    this.dialog.close();
  }

  private openDialog(dialogData: DialogData): void {
    this.dialog = this.dialogFactoryService.open(dialogData);
  }

}

export interface Room{
  id: number;
  name: string;
  bed_count: number;
}