import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../_services/http.service';
import { AccountService, AlertService } from '../../../app/_services';
import { map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject, Observable, BehaviorSubject }    from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  carts: [];
  cartDetails = new Array<any>();
  Carttotal = '';
  weight = '';
  customerAccount: any;
  showExpressCheckout = true;
  images_Url = environment.images_Url;

  private cartUpdates = new Subject<string>();
  public cartUpdates$ = this.cartUpdates.asObservable();
  constructor(private http: HttpService,
              private accountService: AccountService,
              private route: ActivatedRoute,
              private router: Router,
              private alertService: AlertService,
              private title:Title
              ) {}
  _getCart(): void {
    this.http.getCartItems().subscribe((data: any) => {
        this.carts = JSON.parse(JSON.stringify(data));
        this.cartDetails = JSON.parse(JSON.stringify(Object.values(data.products)));
        this.Carttotal = data.total;
        var weight = new Array<any>();
        let sum: number = 0;
        console.log(data);
        if(data.total < 100){
              this.showExpressCheckout = false;
            }else{
              this.showExpressCheckout = true;
            }
        Object.values(data.products).forEach(function (value: any) {
          if(value.weight){
            var weight = parseFloat(value.weight);
          }else{
            var weight = 0;
          }
          sum += (weight * parseFloat(value.qty));
        }); 
        
        this.weight = sum.toFixed(2);
    });
  }
  _increamentQTY(id: any, quantity: any, rowid: any): void {
    /*const qty = quantity/5;
    console.log(qty);


    if(typeof qty == 'number' && !isNaN(qty)){
    
        // check if it is integer
        if (Number.isInteger(qty)) {
            console.log(`${qty} is integer.`);
        }
        else {
            console.log(`${qty} is a float value.`);
        }
    
    } else {
        console.log(`${qty} is not a number`);
    }
  */

  
    const payload = {
      productId: id,
      quantity,
      rowid: rowid
    };
    this.http.increaseQty(payload).subscribe((data: any) => {
      this.http.cartUpdates.next(data.total);
      if(data.message){
        this.alertService.error(data.message, { keepAfterRouteChange: true });
      }
      this._getCart();
    });
    
  }

  getCustomerAccount(){
        this.accountService.getCustomerAccount().subscribe((data: any) => {
            if(data.customer_account.length > 1){
              this.showExpressCheckout = false;
            }
    });
  }

  expressCheckout(){
    this.http.expressCheckout().subscribe({
        next: data => {
            const returnUrl =  '/checkout_confirmation';
            this.router.navigate([returnUrl], { relativeTo: this.route });
        },
        error: error => {
            const returnUrl =  '/checkout_shipping';
            this.router.navigate([returnUrl], { relativeTo: this.route });
        }
    });
  }
  _decreamentQTY(id: any, rowid: any, quantity: any): void {
    const payload = {
      productId: id,
      rowid: rowid,
      quantity,
    };
    this.http.decreaseQty(payload).subscribe((data: any) => {
      this.http.cartUpdates.next(data.total);
      this._getCart();
    });
  }
  _emptyCart(): void {
    this.http.emptyCart().subscribe((data: any) => {
      this.cartUpdates.next('0');
      this._getCart();
    });

  }
  ngOnInit(): void {
    this.title.setTitle('The Shopping Cart: Key Craze, Wholesale Key Blanks and Accessories');
    this._getCart();
    this.getCustomerAccount();
  }

  convertToNumber(string: any){
    return parseFloat(string);
  }
}