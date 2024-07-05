import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService, AlertService } from '../../../app/_services';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent {
  form!: FormGroup;
    loading = false;
    submitted = false;
    checked = false;

constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ){ }

  ngOnInit() {;
        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', Validators.required],
            phone: ['', Validators.required],
            message: ['', Validators.required]
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
    return this.http.post(`${environment.apiUrl}/contact_us`, this.form.value).subscribe((data: any) => {
      if(data.error){
        this.alertService.error('An Error Occurred');
        this.loading = false;
      }else{
        //const returnUrl =  '/contact-us';
        //this.router.navigateByUrl(returnUrl);
        this.alertService.success('Your message has been sent.');
        this.loading = false;
      }
      
    });
  }
}

