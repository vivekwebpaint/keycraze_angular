import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService, AlertService } from '../../../app/_services';

@Component({
  selector: 'app-account-edit',
  templateUrl: './account-edit.component.html',
  styleUrls: ['./account-edit.component.css']
})
export class AccountEditComponent {
  form!: FormGroup;
    loading = false;
    submitted = false;
    AccountData:any;
    checked = false;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ){ }

  ngOnInit() {
        this.account_edit();
        this.form = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: [''],
            email: ['', Validators.required],
            telephone: [''],
            fax: [''],
            customers_email_format: ['']
        });
  }

  account_edit(){
    const getId = localStorage.getItem("user")
    const token =getId?JSON.parse(getId).token:null
    console.log(token)
    const headers = {
      'Authorization': token
    };
    return this.http.get(`${environment.apiUrl}/account_edit`,{headers}).subscribe((data: any) => {
      this.AccountData = data;
      this.checked = true;
      this.form = this.formBuilder.group({
            firstName: [this.AccountData.customers_firstname],
            lastName: [this.AccountData.customers_lastname],
            email: [this.AccountData.customers_email_address],
            telephone: [this.AccountData.customers_telephone],
            fax: [this.AccountData.customers_fax],
            customers_email_format: [this.AccountData.customers_email_format]
       });
    });
  }

  onSubmit(){
    this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }
        this.loading = true;
        const getId = localStorage.getItem("user")
        const token =getId?JSON.parse(getId).token:null
    return this.http.post(`${environment.apiUrl}/account_save`,this.form.value,{headers:{'Authorization':token}}).subscribe((data: any) => {
      if(data.error){
        this.alertService.error('Email Already Exists');
        this.loading = false;
      }else{
        const returnUrl =  '/my-account';
        this.router.navigateByUrl(returnUrl);
        this.alertService.success('Your account has been successfully updated.');
        this.loading = false;
      }
      
    });
  }
}

