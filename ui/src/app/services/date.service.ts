import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  constructor() { }

  today(){
    const Dates = new Date();
    const year: number = Dates.getFullYear();
    const month: any = ( Dates.getMonth() + 1 ) < 10 ? '0' + ( Dates.getMonth() + 1 ) : ( Dates.getMonth() + 1 );
    const day: any = Dates.getDate() < 10 ? '0' + Dates.getDate() : Dates.getDate();
    return year + '-' + month + '-' + day;
  };

  minsAfterMoment(Moment,minutes){
    return new Date(Moment.getTime() + 60000*minutes);
  }

  praseTimeToDisplay(date){
    return date.toLocaleString("zh-CN", {timeZone: "Asia/Shanghai"}) 
  }
}
