import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '../../../app/_services';
import { Title } from '@angular/platform-browser';
import { HttpService } from '../../_services/http.service';

@Component({
  selector: 'app-checkout-shipping',
  templateUrl: './checkout-shipping.component.html',
  styleUrls: ['./checkout-shipping.component.css']
})

export class CheckoutShippingComponent implements OnInit {
addressData = {entry_company:null,
                entry_firstname:null,
                entry_lastname:null,
                entry_street_address:null,
                entry_city:null,
                entry_state:null,
                entry_postcode:null,
                countries_name:null,
                entry_zone_id:null,
                zone_name:null,
                customer_account_map:''
            };

available_shipping_methods: any;
customerAccount: any;
form!: FormGroup;
    loading = false;
    submitted = false;
    data: any;
    checked = '';
    selected = "Free Shipping Options (Free Shipping: UP TO 5 BUSINESS DAYS)";

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
        this.title.setTitle('Step 1 of 3 - Delivery Information : Key Craze, Wholesale Key Blanks and Accessories');
        this.getCustomerAccount();
        this.getAddress();
        this.get_avalable_shipping_methods();
        this.form = this.formBuilder.group({
            shipping_method: ['', Validators.required],
            special_instructions: [this.customerAccount]
        })
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
        this.accountService.select_shpping(this.form.value)
            .pipe(first())
            .subscribe({
                next: data => {
                    this.data = JSON.stringify(data);
                    //this.alertService.success('Registration successful', { keepAfterRouteChange: true });
                    this.router.navigate(['../checkout_payment'], { relativeTo: this.route });
                    
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    getAddress(){
        this.accountService.getAdress().subscribe((data: any) => {
            if(data.out_of_stock_product !== undefined){
                const payload = {
                    productId: data.out_of_stock_product.product_id,
                    rowid: data.out_of_stock_product.rowid,
                    quantity: 0,
                }
                this.http.decreaseQty(payload).subscribe((data: any) => {
                  this.http.cartUpdates.next(data.total);
                  //this._getCart();
                });
                this.alertService.error(data.out_of_stock_product.message, { keepAfterRouteChange: true });
                this.router.navigateByUrl('/cart');
            }
            this.addressData = data;
        });
    }

    getCustomerAccount(){
        this.accountService.getCustomerAccount().subscribe((data: any) => {
            this.customerAccount = data.extra_notes;
        });
    }

    get_avalable_shipping_methods(){
        this.accountService.get_avalable_shipping_methods().subscribe((data: any) => {
            this.available_shipping_methods = JSON.parse(JSON.stringify(data));
            if(data.shipping_data[1].method == 'freeoptions'){
                var value = 'Free Shipping Options (Free Shipping: UP TO 5 BUSINESS DAYS)|0';
                //this.checked = 'shadow-sm';
            }else{
                var value = '';
            }
            this.form = this.formBuilder.group({
                shipping_method: [value, Validators.required],
                special_instructions: [this.customerAccount]
            })
        });
    }

    checkRadio(event: any){
        const boxclass = document.querySelectorAll('.is-invalid .col-md-12');
        boxclass.forEach((element) => {
          element.classList.remove('shadow-sm');
        });
        const box = document.getElementById('radio_' + event);
        if (box != null) {
            box.classList.add('shadow-sm');
        }
        //this.checked = !this.checked;
        //event.srcElement.classList.add("rotatea");
    }
}