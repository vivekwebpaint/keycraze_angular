import { Component, OnInit } from '@angular/core'; 
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '../../../app/_services';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-checkout-shipping-address',
  templateUrl: './checkout-shipping-address.component.html',
  styleUrls: ['./checkout-shipping-address.component.css']
})
export class CheckoutShippingAddressComponent implements OnInit {
addressData : any;
primaryAddressData : any;
entry_country_id: any;
stateData: any;

form!: FormGroup;
    loading = false;
    submitted = false;
    data: any;
    address_id:Object = {};
    constructor(
        private http: HttpClient,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.get_customer_all_address();
        this.get_address();
        this.form = this.formBuilder.group({
            entry_firstname: ['', Validators.required],
            entry_lastname: ['', Validators.required],
            entry_company: ['', Validators.required],
            entry_street_address: ['', Validators.required],
            entry_suburb: [''],
            entry_city: ['', Validators.required],
            entry_state: ['', Validators.required],
            entry_postcode: ['', Validators.required],
            entry_country_id: ['223', Validators.required]
        });
        this.onCountryChange(223);
  }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    select_address(address_id:any) {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        this.loading = true;
        this.accountService.selectAddress(address_id)
            .pipe(first())
            .subscribe({
                next: data => {
                    this.data = JSON.stringify(data);
                    this.router.navigate(['../checkout_shipping'], { relativeTo: this.route });
                    
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    get_customer_all_address(){
        this.accountService.getCustomerAllAddress().subscribe((data: any) => {
            this.addressData = data;
        });
    }

    get_address(){
        this.accountService.getAdress().subscribe((data: any) => {
            this.primaryAddressData = data;
        });
    }

    onCountryChange(newValue:any) {
        this.http.post(`${environment.apiUrl}/get_states`, {id:newValue}).subscribe((data: any) => {
          this.stateData = data;
        })
        console.log(newValue);
        //this.keyMachines = newValue;
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
        return this.http.post(`${environment.apiUrl}/new_address_save`, this.form.value).subscribe((data: any) => {
          if(data.error){
            this.alertService.error('an error occured');
            this.loading = false;
          }else{
            //const returnUrl =  '/my-account';
            //this.router.navigateByUrl(returnUrl);
            this.alertService.success('Your Address has been successfully added.');
            this.loading = false;
            window.location.reload();
          }
          
        });
    }
}