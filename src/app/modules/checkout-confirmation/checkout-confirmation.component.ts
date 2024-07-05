import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '../../../app/_services';
import { HttpService } from '../../_services/http.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-checkout-confirmation',
  templateUrl: './checkout-confirmation.component.html',
  styleUrls: ['./checkout-confirmation.component.css']
})
export class CheckoutConfirmationComponent implements OnInit {
shipping_method :any;
payment_method :any;
cartDetails :any;
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

form!: FormGroup;
    loading = false;
    submitted = false;
    data: any;
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
        this.title.setTitle('Step 3 of 3 - Order Confirmation : Key Craze, Wholesale Key Blanks and Accessories');
        this.getAddress();
        this.getSelectedShippingMethod();
        this.getSelectedPaymentMethod();
        this.getCartData();
  }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    submitOrder(payload:any) {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        //if (this.form.invalid) {
          //  return;
        //}

        this.loading = true;
        this.accountService.process_order(1)
            .pipe(first())
            .subscribe({
                next: data => {
                    this.data = JSON.stringify(data);
                    //this.alertService.success('Registration successful', { keepAfterRouteChange: true });
                    this.router.navigate(['../checkout-success'], { relativeTo: this.route });
                    
                },
                error: error => {
                    this.alertService.error(error);
                   // this.router.navigate(['../checkout_payment'], { relativeTo: this.route });
                    this.loading = false;
                }
            });
    }

    getAddress(){
        this.accountService.getAdress().subscribe((data: any) => {
            if(data.out_of_stock_product !== undefined){
                let payload = {
                    productId: data.out_of_stock_product.product_id,
                    quantity: 0,
                    rowid: data.out_of_stock_product.rowid
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

    getSelectedShippingMethod(){
        this.accountService.getSelectedShippingMethod().subscribe((data: any) => {
            this.shipping_method = data;
            if(data.shipping_method == false){
                this.router.navigate(['../checkout_shipping'], { relativeTo: this.route });
            }
        });
    }

    getSelectedPaymentMethod(){
        this.accountService.getSelectedPaymentMethod().subscribe((data: any) => {
            this.payment_method = data;
            if(data.payment_method == false){
                this.router.navigate(['../checkout_payment'], { relativeTo: this.route });
            }
        });
    }

    getCartData(): void {
        this.http.getCartItems().subscribe((data: any) => {
            this.cartDetails = Object.values(data.products);
        });
    }
}