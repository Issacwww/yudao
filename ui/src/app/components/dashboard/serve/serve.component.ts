import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { RequestService, DateService, StorageService } from 'src/app/services';
import PriorityQueue from '../../PriorityQueue';
import { Room, Service, Crew, Member } from '../../models';
import { DialogService, DialogFactoryService, DialogData } from '../../../modules/dialog';

@Component({
  selector: 'app-serve',
  templateUrl: './serve.component.html',
  styleUrls: ['./serve.component.css']
})
export class ServeComponent implements OnInit {

  private roomEnterPoint = 'rooms/';
  private serviceEnterPoint = 'services/'
  private crewEnterPoint = 'crew/';
  private orderEnterPoint = 'orders/';
  private selectedRoom;

  orderTypes = {
    1:'普通订单',2:'会员订单',3:'线上订单'
  }
  selectedOrderType = 1;
  rooms: Room[] = [];
  services = new Map<number, Service>();
  crew = new Map<number, Crew>();
  

  compareDate = function(a, b) { return a[0] - b[0]; };
  
  dialog: DialogService;
  @ViewChild('serveTemplate')
  serveTemplate: TemplateRef<any>;
  form: FormGroup;

  @ViewChild('confirmTemplate')
  confirmTemplate: TemplateRef<any>;
  confirmMessage:string;

  constructor(
    private dialogFactoryService: DialogFactoryService,
    private formBuilder: FormBuilder,
    private req: RequestService,
    private date: DateService,
    private storage: StorageService
  ) { this.initFormValues();}

  private getServiceById(serviceId){
    return this.services.get(serviceId);
  }

  private getStaffById(staffId){
    return this.crew.get(staffId);
  }

  ngOnInit(): void {
    this.req.baseGet(this.serviceEnterPoint).subscribe((serviceList) => {
      // this.services = serviceList as Service[];
      serviceList.forEach(service => {
        this.services.set(service.id,service);
      });
    })

    this.req.baseGet(this.roomEnterPoint).subscribe((roomList) => {
      this.rooms = roomList as Room[];
      let tmpRoomDate = this.storage.get('serve_rooms');
      if(tmpRoomDate){
        for(let i = 0; i < this.rooms.length; i ++){
          let initValues = (tmpRoomDate[i] && tmpRoomDate[i].length > 0) ? tmpRoomDate[i] : [];
          this.rooms[i].queue = new PriorityQueue<[Date,number]>({
            comparator: this.compareDate,
            initialValues: initValues});
        }
      }
      else{
        this.rooms.forEach(room=>{
          room.queue  =new PriorityQueue<[Date,number]>({comparator: this.compareDate});
        })
      }
    });

    let tmpCrew = this.storage.getMap('serve_crew');
    let tmpCrewMap = new Map<number, Boolean>();
    if(tmpCrew){
      tmpCrew.forEach(tmpStaff=>{
        tmpCrewMap.set(tmpStaff['id'], (tmpStaff as Crew).inServe);
      })
    }
    this.req.baseGet(this.crewEnterPoint).subscribe(crewList =>{
      crewList.forEach(staff => {
        staff['inServe'] = tmpCrewMap.get(staff['id']) ? tmpCrewMap.get(staff['id']) : false;
        this.crew.set(staff.id, staff);
      });
      this.storage.setMap('serve_crew', this.crew);
    })
    
    
    setInterval(()=>{
      let now = new Date();
      let roomsQueueData = [];
      this.rooms.forEach(room => {
          while(room.queue.length > 0 && 
            (new Date(room.queue.peek()[0]).getTime() <=now.getTime())){
              console.log('rm');
              let peek = room.queue.dequeue();
              this.crew.get(peek[1]).inServe = false;
          };
          roomsQueueData.push(room.queue.values());
      });
      this.storage.setMap('serve_crew', this.crew);
      this.storage.set('serve_rooms',roomsQueueData);
    },1000*10);
  }

  Order(){
    //select room, service, staff
    //post data to table 'customerOrder'
    let serviceId = parseInt(this.form.value.service);
    let selectedService = this.getServiceById(serviceId);
    let selectedStaff = this.getStaffById(this.form.value.staff);
    let order_date_time = this.date.today(true);
    let message = "";
    let postData = {
      order_type:this.selectedOrderType,
      staff: this.form.value.staff,
      service: serviceId, 
      room: this.selectedRoom.id,
      bedNo: this.selectedRoom.queue.length + 1,
      order_date: order_date_time[0],
      order_time: order_date_time[1],
      consumption: +selectedService.price
    }
    if(this.selectedOrderType == 2){
      postData['member_info']=this.form.value.card_number;

    }else if(this.selectedOrderType == 3){
      postData['order_source']="线上 - "+this.form.value.order_source;
      postData.consumption = this.form.value.order_consumption;
    }
    
    this.req.basePost(this.orderEnterPoint,postData).subscribe(
      res=>{
        selectedStaff.inServe = true;
        this.storage.setMap('serve_crew', this.crew);

        let nextAvailableTime = this.date.minsAfterMoment(new Date(), selectedService.duration);
        this.selectedRoom.queue.queue([nextAvailableTime,selectedStaff.id]);
        
        let roomQueueData = [];
        this.rooms.forEach(room=>{roomQueueData.push(room.queue.values())});
        this.storage.set('serve_rooms',roomQueueData);
        message += this.selectedOrderType === 2 ? `会员:${res.member_info}\n` : '';
        message +=  `技师: ${selectedStaff.name}\n`
                    + `房间: ${this.selectedRoom.name}, 床位号: ${this.selectedRoom.queue.length}\n`
                    + `预计结束时间: ${nextAvailableTime}`
        this.changeDialog(this.orderTypes[this.selectedOrderType], message);
      },
      error=>{
        this.changeDialog("警告",error.message);
      })
  }
  
  initFormValues(){
    this.form = this.formBuilder.group({
      card_number: [''],
      service: [''],
      staff: [''],
      order_source:[''],
      order_consumption: ['']
    });
  }

  
  nextAvailableTime(room){
    return this.date.praseTimeToDisplay(room.queue.peek());
  }

  openServeDialog(room){
    this.selectedOrderType = 1;
    this.form.reset();
    this.selectedRoom = room;
    this.openDialog({
      headerText:`上钟房间: ${room.name}`,
      template: this.serveTemplate
    })
  }

  close(){
    this.dialog.close();
  }

  private openDialog(dialogData: DialogData): void {
    this.dialog = this.dialogFactoryService.open(dialogData);
  }

  private changeDialog(title,msg){
    this.dialog.setHeaderText(title);
    this.confirmMessage = msg;
    this.dialog.setTemplate(this.confirmTemplate);
  }
}
