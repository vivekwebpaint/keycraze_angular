import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService, AlertService } from '../../../app/_services';
import { ConfirmedValidator } from '../account/confirmed.validator';

@Component({
  selector: 'app-account-password',
  templateUrl: './account-password.component.html',
  styleUrls: ['./account-password.component.css']
})
export class AccountPasswordComponent implements OnInit {
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
        this.form = this.formBuilder.group({
            current_password: ['', Validators.required],
            new_password: ['', [Validators.required, Validators.minLength(6)]],
            confirm_password: ['', [Validators.required, Validators.minLength(6)]]
        },{
          validator: ConfirmedValidator('new_password', 'confirm_password')
        });
  }

  get f() { return this.form.controls; }

  onSubmit(){
    this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }
        this.loading = true;
    return this.http.post(`${environment.apiUrl}/update_password`, this.form.value).subscribe((data: any) => {
      if(data.error){
        this.alertService.error('Please enter correct password');
        this.loading = false;
      }else{
        const returnUrl =  '/my-account';
        this.router.navigateByUrl(returnUrl);
        this.alertService.success('Your password has been successfully updated.');
        this.loading = false;
      }
    });
  }
}

