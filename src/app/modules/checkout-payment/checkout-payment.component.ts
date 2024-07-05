import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import {KeyValue} from '@angular/common';

import { AccountService, AlertService } from '../../../app/_services';
import { Title } from '@angular/platform-browser';
import $ from "jquery";

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.css']
})
export class CheckoutPaymentComponent implements OnInit {
shipping_method : any;
customerAccount = {extra_notes:null, customer_account:null, cc_number:null, cc_expires:null, mo: null};
amc: any;
AccountNumber: any;
Acc = new Array<any>();
special_instructions: any;
TotalPaymentMethods = 9;
show: boolean = false;
showBilling: boolean = false;
//addressData: any;
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
    addClass=false;
    po_order:any;
    store:any;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService,
        private title:Title
    ) { }

    ngOnInit() {
        this.title.setTitle('Step 2 of 3 - Payment Information : Key Craze, Wholesale Key Blanks and Accessories');
        this.getAddress();
        this.getCustomerAccount();
        this.getSelectedShippingMethod();
        this.form = this.formBuilder.group({
            payment_method: ['', Validators.required],
            hear_about_us: [''],
            hear_about_us_other: [''],
            special_instructions: [this.special_instructions],
            card_name: [''],
            card_number: [''],
            card_exp: [''],
            card_exp_year: [''],
            card_cvv: [''],
            same_as_shipping: [''],
            billingAddress: ['']
        });

        
        //const box = document.getElementById('pid-' + id);
          //  if (box != null) {
           // box.classList.add('product-shadow');
          //}
    }

    unSecureCard(){
        this.show = true;
    }

    secureCard(){
        this.show = false;
    }

    showBillingTexarea(){
        this.showBilling = !this.showBilling;
    }

    creditCardType(cc: string) {
      let amex = new RegExp('^3[47][0-9]{13}$');
      let visa = new RegExp('^4[0-9]{12}(?:[0-9]{3})?$');
      let cup1 = new RegExp('^62[0-9]{14}[0-9]*$');
      let cup2 = new RegExp('^81[0-9]{14}[0-9]*$');

      let mastercard = new RegExp('^5[1-5][0-9]{14}$');
      let mastercard2 = new RegExp('^2[2-7][0-9]{14}$');

      let disco1 = new RegExp('^6011[0-9]{12}[0-9]*$');
      let disco2 = new RegExp('^62[24568][0-9]{13}[0-9]*$');
      let disco3 = new RegExp('^6[45][0-9]{14}[0-9]*$');
      
      let diners = new RegExp('^3[0689][0-9]{12}[0-9]*$');
      let jcb =  new RegExp('^35[0-9]{14}[0-9]*$');


      if (visa.test(cc)) {
        return this.is_valid(cc);
        //return 'VISA';
      }
      if (amex.test(cc)) {
        return this.is_valid(cc);
        //return 'AMEX';
      }
      if (mastercard.test(cc) || mastercard2.test(cc)) {
        return this.is_valid(cc);
        //return 'MASTERCARD';
      }
      if (disco1.test(cc) || disco2.test(cc) || disco3.test(cc)) {
        return this.is_valid(cc);
        //return 'DISCOVER';
      }
      //if (diners.test(cc)) {
        //return 'DINERS';
      //}
      //if (jcb.test(cc)) {
        //return 'JCB';
      //}
      //if (cup1.test(cc) || cup2.test(cc)) {
        //return 'CHINA_UNION_PAY';
      //}
      return;
    }



    is_valid(cc_number:any) {
      let cardNumber = cc_number.toString().split("").reverse().join("");
      let numSum = 0;

      for (let i = 0; i < cardNumber.length; i++) {
        let currentNum = parseInt(cardNumber.charAt(i));

        // Double every second digit
        if (i % 2 === 1) {
          currentNum *= 2;
        }

        // Add digits of 2-digit numbers together
        if (currentNum > 9) {
          let firstNum = currentNum % 10;
          let secondNum = Math.floor(currentNum / 10);
          currentNum = firstNum + secondNum;
        }

        numSum += currentNum;
      }

      // If the total has no remainder it's OK
      return numSum % 10 === 0;
    }

    ngAfterContentChecked() {
        let box = $('.payment_main').length;
         this.TotalPaymentMethods = (box - 2);
         $(".payment_main").each(function(i) {
            $(this).find('.form-check-label').not('.custom_check + .form-check-label.fw-bold').html(i+1+')');
        });
         if((box - 2 ) == 1){
            $('.payment_main').find('.form-check-input').trigger('click').trigger('click');
         }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    radio_clicked(event:any){
        //console.log(event.srcElement);
        event = event.srcElement;
        //console.log((event.target as HTMLInputElement).value);
        const box = $('.payment_main').not('.hear_us, .special_instructions');
        box.addClass('opacity-50');
        box.removeClass('active-radio');
        //if (box != null) {
        //    box.classList.remove('product-shadow');
        //}
        //(event.target as HTMLInputElement).classList.add('radio_active');
        $(event).closest('.payment_main').find('.form-check-input').not('.custom_check').trigger('click');
        //$(event).closest('.payment_main').find('.form-check-input').prop("checked", true);
        //$(event).closest('.form-check-input').prop("checked", true);
        //console.log($(event).closest('.payment_main'));
        $(event).closest('.payment_main').removeClass('opacity-50');
        $(event).closest('.payment_main').addClass('active-radio');
        this.po_order = $(event).closest('.payment_main').find('.po_order');
        this.store = $(event).closest('.payment_main').find('.store');
    }

    onSubmit() {
        //console.log(this.creditCardType(this.form.value.card_number));
        if(this.form.value.payment_method == 'New Credit Card'){
            this.form.value['cctype'] = this.creditCardType(this.form.value.card_number);
            if((this.form.value['cctype'] === undefined) || (this.form.value['cctype'] == false)){
                alert('please enter valid credit card');
                return;
            }else if(this.form.value['card_name'] == ''){
                alert('please enter Name on Card');
                return;
            }else if(this.form.value['card_exp'] == ''){
                alert('please select card expiry month');
                return;
            }else if(this.form.value['card_exp_year'] == ''){
                alert('please select card expiry year');
                return;
            }else if(this.form.value['card_cvv'] == ''){
                alert('please enter card cvv');
                return;
            }

            if(this.customerAccount.cc_number && this.customerAccount.cc_expires){
                var cc4_1 = parseInt(this.form.value.card_number.slice(-4));
                const cc4_2 = parseInt(this.customerAccount.cc_number);
                var ccexpires_1 = (this.form.value.card_exp + this.form.value.card_exp_year);
                var ccexpires_2 = (this.customerAccount.cc_expires);
                if((cc4_1 == cc4_2) && (ccexpires_1 == ccexpires_2)){
                    this.form.value.payment_method = 'Credit Card On File'
                }
                
            }
        }
        if(this.form.value.payment_method == 'Credit Card On File'){
            if(this.customerAccount.cc_expires){
                const month = this.getFirstTwoChar(this.customerAccount.cc_expires);
                const year = this.getlastTwoChar(this.customerAccount.cc_expires);
                const fullyear = parseInt(`${20}${year}`);
                var today = new Date();
                var future = new Date(fullyear, month, 1);
                if (future.setHours(0, 0, 0, 0) <= today.setHours(0, 0, 0, 0)) {
                    alert('Your Card is Expired, please enter new Credit Card');
                    return true;
                }
            }
        }
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        if(this.po_order == undefined){
            //alert('please select store');
            //return;
        }
        if((this.form.value.payment_method == 'New Credit Card') || (this.form.value.payment_method == 'Credit Card On File') || (this.form.value.payment_method == 'Check/Money Order')) {
        }else{
            if(this.store.val() == ''){
                alert('Account Number is required');
                return;
            }
            if(this.po_order.val() == ''){
                alert('please enter PO');
                return;
            }
        }
        this.accountService.select_payment(this.form.value, this.po_order.val(), this.store.val())
            .pipe(first())
            .subscribe({
                next: data => {
                    this.data = JSON.stringify(data);
                    //this.alertService.success('Registration successful', { keepAfterRouteChange: true });
                    this.router.navigate(['../checkout_confirmation'], { relativeTo: this.route });
                    
                },
                error: error => {
                    this.alertService.error(error);
                    this.router.navigate(['../checkout_payment'], { relativeTo: this.route });
                    this.loading = false;
                }
            });
    }

    getAddress(){
        this.accountService.getAdress().subscribe((data: any) => {
            this.addressData = data;
        });
    }

    getCustomerAccount(){
        this.accountService.getCustomerAccount().subscribe((data: any) => {
            this.customerAccount = data;
            this.amc = data.amc;
            this.AccountNumber = data.customer_account;
            //console.log(this.amc);
             this.form = this.formBuilder.group({
                payment_method: ['', Validators.required],
                hear_about_us: [''],
                hear_about_us_other: [''],
                special_instructions: [this.special_instructions],
                card_name: [''],
                card_number: [''],
                card_exp: [''],
                card_exp_year: [''],
                card_cvv: [''],
                same_as_shipping: ['1'],
                billingAddress: []
            });
        });
    } 

    onChange(event:any){
        var store = event.target.options[event.target.selectedIndex].dataset.store;
        if(store){
            this.accountService.selectAddress(store).subscribe((data: any) => {
                this.getAddress();
            });
        }
    }

    getSelectedShippingMethod(){
        this.accountService.getSelectedShippingMethod().subscribe((data: any) => {
            this.shipping_method = data;
            this.special_instructions = data.special_instructions;
            this.form = this.formBuilder.group({
                payment_method: ['', Validators.required],
                hear_about_us: [''],
                hear_about_us_other: [''],
                special_instructions: [data.special_instructions],
                card_name: [''],
                card_number: [''],
                card_exp: [''],
                card_exp_year: [''],
                card_cvv: [''],
                same_as_shipping: ['1'],
                billingAddress: []
            });
            if(data.shipping_method == false){
                this.router.navigate(['../checkout_payment'], { relativeTo: this.route });
            }
        });
    }

    getFirstChar(text:any){
        if(text){
            return text.charAt(0);
        }else{
            return '';
        }
    }
    getFirstTwoChar(text:any){
        if(text){
            return text.slice(0, 2);
        }
    }

    getlastTwoChar(text:any){
        if(text){
            return text.slice(-2);
        }
    }

    filterChars(char2:any){
        var acc = new Array<any>();
        $.each( this.AccountNumber, function( key, value ) {
            var abc = value;
            var key = key;
            if(abc.length > 0){
                const account_map = abc.charAt(0);
                const showMethod = (/[tadobpwulh]/.test(account_map.toLowerCase()));
                if(account_map.toLowerCase().includes(char2) ||
                    showMethod == false ||
                    account_map == ''
                ){
                    console.log(abc);
                    acc.push(abc);
                    return abc;
                }
            }
        });
        this.Acc = acc;
    }

    checkPaymentMethods(char:any, char2 = ''){
        if(this.AccountNumber){
            var temp = new Array<any>();
            var acc = new Array<any>();
            //var abc = this.AccountNumber.join("");
            $.each( this.AccountNumber, function( key, value ) {
                var abc = value;
                const account_map = abc.charAt(0);
                const showMethod = (/[tadobpwulh]/.test(account_map.toLowerCase()));
                if(char2 == ''){
                    if(account_map.toLowerCase().includes(char) ||
                        showMethod == false ||
                        account_map == ''
                    ){
                        acc.push(abc);
                        temp.push('true');
                    }
                }else{
                    const account_map2 = abc.slice(0, 2);
                    if((account_map.toLowerCase().includes(char) && account_map2.toLowerCase() != char2 && account_map2.toLowerCase() != 'ad' ) ||
                        showMethod == false ||
                        account_map == ''
                    ){
                        acc.push(abc);
                        temp.push('true');
                    }
                }
            });
            //console.log(acc);
            if(temp.length > 0){
                //this.Acc = acc;
                return true;
            }
        }else{
            return true;
        }
    }


    checkTrueValue(){
        return this.checkPaymentMethods('t');
    }

    checkAceHardware(){
        return this.checkPaymentMethods('a', 'ap');
    }

    checkDoItBest(){
        return this.checkPaymentMethods('d');
    }

    checkOrgillStore(){
        return this.checkPaymentMethods('o');
    }

    checkBostwickBraun(){
        return this.checkPaymentMethods('b');
    }

    checkHouseHasson(){
        return this.checkPaymentMethods('h');
    }

    checkCcOnFile(){
        if(this.AccountNumber){
           // const shipping_method = this.shipping_method.shipping_method.label;
            var temp = new Array<any>();
            $.each( this.AccountNumber, function( key, value ) {
                var abc = value;
                const account_map = abc.charAt(0);
                const account_map2 = abc.slice(0, 2);
                const showMethod = (/[tadobpwulh]/.test(account_map.toLowerCase()));
                const showMethod2 = (/[pwul]/.test(account_map.toLowerCase()));
                if(
                    showMethod2 == true ||
                    showMethod == false ||
                    account_map2.toLowerCase().includes('ap') ||
                    account_map2.toLowerCase().includes('u') ||
                    account_map2.toLowerCase().includes('ad') ||
                    account_map == ''
                ){
                    temp.push('true');
                }
            });
            if(temp.length > 0){
                return true;
            }
        }else{
            return true;
        }
    }

    CommaToArray(str: any){
        var temp = new Array();
    // This will return an array with strings "1", "2", etc.
        return temp = str.split(",");
    }
}