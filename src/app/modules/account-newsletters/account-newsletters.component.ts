import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../../_services/http.service';
import { AlertService } from '../../../app/_services';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-account-newsletters',
  templateUrl: './account-newsletters.component.html',
  styleUrls: ['./account-newsletters.component.css']
})
export class AccountNewslettersComponent {

form!: FormGroup;
    loading = false;
    submitted = false;

  product_data:any;
  cartDetails = new Array<any>();
  images_Url = environment.images_Url;

  constructor(
        private http: HttpClient,
        public activatedRoute: ActivatedRoute,
        private formBuilder: FormBuilder,
        private https: HttpService,
        private alertService: AlertService
    ) { 
     this.form = this.formBuilder.group({
          newsletter: [],
        });
  }

  ngOnInit() {
      this.newseletter_settings();
  }

   onSubmit() {
        this.submitted = true;
        this.alertService.clear();
        if (this.form.invalid) {
            return;
        }
        this.loading = true;
        return this.http.post(`${environment.apiUrl}/newseletter_settings_update`, this.form.value).subscribe((data: any) => {
          this.alertService.success('Newsletter Subscription has been successfully updated.');
      });
    }

  newseletter_settings(){
    return this.http.get(`${environment.apiUrl}/newseletter_settings`).subscribe((data: any) => {
        this.form = this.formBuilder.group({
          newsletter: [parseInt(data.customers_newsletter)],
        });
    });
  }
}
