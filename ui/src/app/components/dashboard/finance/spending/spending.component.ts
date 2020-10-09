import { Component, OnInit, ViewChild, TemplateRef  } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Spending } from '../../../models';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DialogService, DialogFactoryService, DialogData } from 'src/app/modules/dialog';
import { RequestService, DateService } from 'src/app/services';

@Component({
  selector: 'app-spending',
  templateUrl: './spending.component.html',
  styleUrls: ['./spending.component.css']
})
export class SpendingComponent implements OnInit {

  enterPoint='spending/'
  spends = new MatTableDataSource<Spending>();
  spendsCount = 0;
  displayedColumns = ['id', 'spending_type','spend_date','amount','detail'];
  spendingTypes = ['水电费','店铺租金','伙食费','其他']
  dialog: DialogService;
  expandedElement: any;

  @ViewChild('addNewSpendingRecordTemplate')
  addNewSpendingRecordTemplate: TemplateRef<any>;

  @ViewChild('confirmTemplate')
  confirmTemplate: TemplateRef<any>;
  confirmMessage:string;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  //todo: add filter

  form: FormGroup;
  constructor(
    private dialogFactoryService: DialogFactoryService,
    private formBuilder: FormBuilder,
    private req: RequestService,
    private date: DateService
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
      this.spendsCount = spendingList.length;
      this.spends.data = spendingList;
      this.spends.sort = this.sort;
      this.spends.paginator = this.paginator;
    })
  }

  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  

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

