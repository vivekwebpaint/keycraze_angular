import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '../../../app/_services';
import { HttpService } from './../../_services/http.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-password-forgotten',
  templateUrl: './password-forgotten.component.html',
  styleUrls: ['./password-forgotten.component.css']
})
export class PasswordForgottenComponent implements OnInit {
    form!: FormGroup;
    loading = false;
    submitted = false;
    show: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService,
        private http: HttpService,
        private title:Title
    ) { }

    ngOnInit() {
        this.title.setTitle('Password Forgotten : Key Craze, Wholesale Key Blanks and Accessories');
        this.form = this.formBuilder.group({
            email: ['', Validators.required]
        });
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
        this.http.reset_password(this.f.email.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    // get return url from query parameters or default to home page
                    this.alertService.success('Thank you. If that email address is in our system, we will send password recovery instructions to that email address.', { keepAfterRouteChange: true });
                    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/account/login';
                    this.router.navigateByUrl(returnUrl);
                }
            });
    }
}