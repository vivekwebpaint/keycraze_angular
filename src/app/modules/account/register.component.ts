import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ConfirmedValidator } from './confirmed.validator';
import { Title } from '@angular/platform-browser';
import { AccountService, AlertService } from '../../../app/_services';
import { HttpService } from './../../_services/http.service';

@Component({ templateUrl: 'template/register.component.html' })
export class RegisterComponent implements OnInit {
    form!: FormGroup;
    loading = false;
    submitted = false;
    data: any; 
    stateData: any;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService,
        private title:Title,
        private http: HttpService
    ) { }

    ngOnInit() {
        this.title.setTitle('Create an Account : Key Craze, Wholesale Key Blanks and Accessories');
        this.form = this.formBuilder.group({
            firstName: ['', Validators.required],
            company: ['', Validators.required],
            permitno: [''],
            entry_street_address: ['', Validators.required],
            entry_city: ['', Validators.required],
            entry_zone_id: ['', Validators.required],
            entry_postcode: ['', Validators.required],
            entry_country_id: ['223', Validators.required],
            customers_telephone: ['', Validators.required],
            customers_fax: [''],
            customers_email_address: ['', Validators.required],
            customers_advertisement: [''],
            customers_email_format: ['HTML'],
            customers_newsletter: ['1'],
            lastName: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmpassword: ['', [Validators.required, Validators.minLength(6)]]
        }, { 
      validator: ConfirmedValidator('password', 'confirmpassword')
    })
        this.onCountryChange(223);
  }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true; 
        this.accountService.register(this.form.value)
            .pipe(first())
            .subscribe({
                next: data => {
                    this.data = data;
                    if(this.data['user_exists']){
                        //this.alertService.error(this.data['user_exists']);
                        alert('Email Already Registred');
                        this.loading = false;
                        return;
                    }else{
                        this.http.loginAfterRegister(data);
                        this.alertService.success('Registration successful', { keepAfterRouteChange: true });
                        this.router.navigateByUrl('/');
                    }
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    onCountryChange(newValue:any) {
        this.accountService.get_states({id:newValue}).subscribe((data: any) => {
          this.stateData = data;
        })
    }
}