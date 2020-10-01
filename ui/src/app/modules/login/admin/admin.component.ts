import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder,Validators } from '@angular/forms';
import { RequestService, StorageService } from '../../../services';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  constructor(
    public req: RequestService,
    public storage: StorageService,
    private formBuilder: FormBuilder,
    private router: Router) { }
  
  valid: boolean;
  validateMsg: String;
  form = this.formBuilder.group({
    name: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });
  
  ngOnInit() {
    this.toggle(false, '');
  }
  
  private INPUT_REQUIRED = '请输入用户名 / 密码';

  get name(){
    return this.form.get('name');
  }

  get password(){
    return this.form.get('password');
  }

  toggle(valid: boolean, msg: string): void {
    this.valid = valid;
    this.validateMsg = msg;
  }

  login(): void {
    if (!(this.form.valid )){
      this.toggle(true, this.INPUT_REQUIRED);
      return;
    }
    // catch login error -> show the error message
    this.req.basePost('auth/', {
      admin_name: this.name.value,
      password: this.password.value,
      store: '0'
    }).subscribe(
      (data) => {
        console.log(data);
        this.toggle(false, '');
        this.storage.set('token',data['token']);
        this.router.navigateByUrl('/dashboard');
      },
      (error) => {
        this.toggle(true, error.error.non_field_errors[0]);
      }
    );
  }
}
