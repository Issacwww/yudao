import { Component, OnInit, ViewChild, TemplateRef  } from '@angular/core';
import { Spending } from './spending';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DialogService, DialogFactoryService, DialogData } from 'src/app/modules/dialog';
import { RequestService,StorageService,DateService } from 'src/app/services';

@Component({
  selector: 'app-spending',
  templateUrl: './spending.component.html',
  styleUrls: ['./spending.component.css']
})
export class SpendingComponent implements OnInit {

  enterPoint='spending/'
  spends = [];
  tHead = ['支出编号','支出类型','支出日期','支出金额','支出明细']
  spendingTypes = ['水电费','店铺租金','伙食费','其他']
  dialog: DialogService;
  @ViewChild('addNewSpendingRecordTemplate')
  addNewSpendingRecordTemplate: TemplateRef<any>;

  form: FormGroup;
  constructor(
    private dialogFactoryService: DialogFactoryService,
    private formBuilder: FormBuilder,
    private req: RequestService,
    private date: DateService,
    private storage: StorageService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      spending_type: [''],
      amount: [''],
      detail: ['无']
    });
    this.getAllSpending();
  }

  getAllSpending(){
    this.req.baseGet(this.enterPoint).subscribe(spendingList => {
      this.spends = spendingList as Spending[];
      this.spends.sort((a, b) => a.spend_date > b.spend_date ? -1 : 1);
      this.storage.set('spends', this.spends);
    })
  }

  newSpending(){
    this.openDialog({
      headerText:"记录开支",
      template: this.addNewSpendingRecordTemplate
    })
  }

  save(){
    let newRecord = this.form.value;
    newRecord['spend_date'] = this.date.today();
    this.req.basePost(this.enterPoint,newRecord).subscribe((res)=>this.ngOnInit());
    this.close();
  }

  close(){
    this.dialog.close();
  }

  private openDialog(dialogData: DialogData): void {
    this.dialog = this.dialogFactoryService.open(dialogData);
  }
}
