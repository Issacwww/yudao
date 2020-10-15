export interface Crew {
    id: Number;
    name: String;
    gender: Boolean;
    national_id:String;
    phone: String;
    crew_number: String;
    hire_date: Date;
    inServe: Boolean;
}


export interface Spending{
    id: number;
    spending_type: String;
    detail: String;
    amount: number;
    spend_date: Date;
}

export interface TopUpRecord{
    id:number;
    member:string;
    topup_date:Date;
    amount:number;
}

export interface Service {
    id: Number;
    name: String;
    duration: number;
    price: number;
}

export interface Member {
    id: Number;
    name: String;
    gender: Boolean;
    phone: String;
    card_number: String;
    open_date: Date;
    balance: number;
}

export interface Room{
    id: number;
    name: string;
    bed_count: number;
    queue: any;
}  

export interface Order{
  id: number;
  service: string;
  staff:string;
  room: string;
  bedNo: number;
  order_date: Date;
  order_time: string;
  consumption: number;
  member_info: string;
}