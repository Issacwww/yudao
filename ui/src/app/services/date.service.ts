import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  constructor() { }

  firstOfMonth(){
    const Dates = new Date();
    const year: number = Dates.getFullYear();
    const month: any = ( Dates.getMonth() + 1 ) < 10 ? '0' + ( Dates.getMonth() + 1 ) : ( Dates.getMonth() + 1 );
    return year + '-' + month + '-01';
  }

  today(min: boolean){
    const Dates = new Date();
    const year: number = Dates.getFullYear();
    const month: any = ( Dates.getMonth() + 1 ) < 10 ? '0' + ( Dates.getMonth() + 1 ) : ( Dates.getMonth() + 1 );
    const day: any = Dates.getDate() < 10 ? '0' + Dates.getDate() : Dates.getDate();
    const hour: any = ( Dates.getHours() + 1 ) < 10 ? '0' + ( Dates.getHours() + 1 ) : ( Dates.getHours() + 1 );
    const mins: any = ( Dates.getMinutes() + 1 ) < 10 ? '0' + ( Dates.getMinutes() + 1 ) : ( Dates.getMinutes() + 1 );
    const today = year + '-' + month + '-' + day;
    return  min ? [today,hour + ':' + mins] : today;
  }

  minsAfterMoment(Moment, minutes){
    return new Date(Moment.getTime() + 60000*minutes);
  }

  praseTimeToDisplay(date){
    return date.toLocaleString("zh-CN", {timeZone: "Asia/Shanghai"}) 
  }

}
