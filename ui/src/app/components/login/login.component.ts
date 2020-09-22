import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from "@angular/forms";
import { RequestService } from '../../services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public tabList = [
    {
      id: 1,
      title: '店长登录'
    },
    {
      id: 2,
      title: '管理员登录'
    }
  ];
  private INPUT_REQUIRED = '请输入用户名 / 密码';
  private STORE_REQUIRED = '请选择门店';
  public stores = {};
  public tabSelected = 1;
  public valid;
  public validateMsg;
  constructor(
    private router: Router,
    public req: RequestService,
    public fb: FormBuilder
  ) { }

  loginForm = this.fb.group({
    store: ['', [Validators.required]],
    admin_name: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  get store(){
    return this.loginForm.get('store');
  }

  get admin_name(){
    return this.loginForm.get('admin_name');
  }

  get password(){
    return this.loginForm.get('password');
  }

  ngOnInit(): void {
    this.toggle(false, '');
    this.loadStores();
  }

  tabChange(id: number): void{
    this.tabSelected = id;
  }

  changeStore(e): void {
    this.store.setValue(e.target.value, {
      onlySelf: true
    });
  }

  loadStores(): void{
    this.req.baseGet('stores').subscribe(
      (storeList) => {
        // console.log(storeList);
        storeList.forEach(store => {
          this.stores[store.id] = store.store_name;
        });
      }
    );
  }

  toggle(valid: boolean, msg: string): void {
    this.valid = valid;
    this.validateMsg = msg;
  }

  login(): void {
    console.log('store' + this.store.valid);

    console.log(this.loginForm.valid);
    if (this.tabSelected === 1 && !this.store.valid) {
      this.toggle(true, this.STORE_REQUIRED);
      return;
    }
    else if (!(this.admin_name.valid && this.password.valid)){
      this.toggle(true, this.INPUT_REQUIRED);
      return;
    }
    // catch login error -> show the error message
    this.req.basePost('auth/', {
      admin_name: this.admin_name.value,
      password: this.password.value,
      store: this.store.value,
      responseType: 'json'
    }).subscribe(
      (data) => {
        console.log(data);
        this.toggle(false, '');
      },
      (error) => {
        this.toggle(true, error.error.non_field_errors[0]);
      }
    );
  }
}
