import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup,Validators } from '@angular/forms';
import { RequestService, StorageService } from '../../../services';
@Component({
  selector: 'app-store-manager',
  templateUrl: './store-manager.component.html',
  styleUrls: ['./store-manager.component.css']
})
export class StoreManagerComponent implements OnInit {
  
  constructor(
    public req: RequestService,
    public storage: StorageService,
    private formBuilder: FormBuilder,
    private router: Router) { }
  
  stores = [];
  valid: boolean;
  validateMsg: String;
  form = this.formBuilder.group({
    storeControl: ['', [Validators.required]],
    name: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });
  

  ngOnInit() {
    this.toggle(false, '');
    this.loadStores();
  }
  
  private INPUT_REQUIRED = '请输入用户名 / 密码';
  private STORE_REQUIRED = '请选择门店';
  
  get storeControl(){
    return this.form.get('storeControl');
  }

  get name(){
    return this.form.get('name');
  }

  get password(){
    return this.form.get('password');
  }

  loadStores(): void{
    this.req.baseGet('stores').subscribe(
      (storeList) => {
        storeList.forEach(store => {
          this.stores.push({
            id: store.id,
            name: store.store_name
          })
        });
      }
    );
  }

  toggle(valid: boolean, msg: string): void {
    this.valid = valid;
    this.validateMsg = msg;
  }

  login(): void {
    if (!this.storeControl.valid) {
      this.toggle(true, this.STORE_REQUIRED);
      return;
    }
    else if (!(this.name.valid && this.password.valid)){
      this.toggle(true, this.INPUT_REQUIRED);
      return;
    }
    // catch login error -> show the error message
    this.req.basePost('auth/', {
      admin_name: this.name.value,
      password: this.password.value,
      store: this.storeControl.value,
      responseType: 'json'
    }).subscribe(
      (data) => {
        console.log(data);
        this.toggle(false, '');
        this.storage.set('token',data['token']);
        this.storage.set('store',this.storeControl.value);
        this.router.navigateByUrl('/dashboard');
      },
      (error) => {
        this.toggle(true, error.error.non_field_errors[0]);
      }
    );
  }

}

