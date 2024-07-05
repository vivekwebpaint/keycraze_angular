import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { AccountService } from './../../_services';
import { User } from './../../_models';
import { HttpService } from './../../_services/http.service';

import { LoadingIndicatorService } from './../../_services/LoadingIndicatorService';
import { LoadingInterceptorService } from './../../_services/LoadingInterceptorService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public logoImage: string;
  //title = 'Key Craze, Wholesale Key Blanks and Accessories';
  show_cart = false;
  loading:any;
  //user?: User | null;
  user = JSON.parse(JSON.stringify(this.accountService.userValue));

    constructor(private accountService: AccountService,
                private http: HttpService,
                private router: Router,
                private title:Title,
                private loadingIndicatorService: LoadingIndicatorService) {
      loadingIndicatorService.onLoadingChanged.subscribe(
      (isLoading) => (this.loading = isLoading)
    );
        this.http.user.subscribe(x => this.user = x);
        JSON.parse(JSON.stringify(this.user));
        this.router.events.subscribe((event: any) => {
          if ((this.router.url.includes('/category')) ||
           (this.router.url.includes('/product/')) ||
           (this.router.url.includes('/search/')) ||
           (this.router.url.includes('/search-keys/')) ||
           (this.router.url.includes('/account-history-view-order/')) ||
           (this.router.url.includes('/order-history'))
          ){
            this.show_cart = true;
          }
        });
    }

    logout() {
        this.http.logout().subscribe((data: any) => {
      });
      this.Carttotal = '0';
      this.router.navigate(['/account/login']);
    }
    cartDetails = new Array<any>();
    public Carttotal = '0';

    _getCart(): void {
      this.http.getCartItems().subscribe((data: any) => {
          //this.cartDetails = JSON.parse(JSON.stringify(Object.values(data.products)));
          this.Carttotal = data.total;
          if(this.user != null){
            if(this.user.customers_id != data.customers_id){
              this.logout();
            }
          }
          //console.log(data.products);
      });
    }
    ngOnInit(): void {
      const currentDate = new Date();
      const month = currentDate.getMonth() + 1;
      const day = currentDate.getDate();

      if ((month === 1 && (day >= 1 && day <= 10))) {
        this.logoImage = '/assets/images/keycraze_logo_newyear.png';
      } else if ((month === 5 && (day >= 15 && day <= 30))) {
        this.logoImage = '/assets/images/keycraze_logo_memorial.png';
      } else if ((month === 10 && (day >= 1 && day <= 20))) {
        this.logoImage = '/assets/images/keycraze_logo_brestcancer.png';
      } else if ((month === 10 && (day >= 23 && day <= 25))) {
        this.logoImage = '/assets/images/keycraze_logo_diwali.png';
      } else if ((month === 10 && (day >= 27 && day <= 31))) {
        this.logoImage = '/assets/images/keycraze_logo_holloween.png';
      } else if ((month === 11 && (day >= 9 && day <= 13))) {
        this.logoImage = '/assets/images/keycraze_logo_veterans.png';
      } else if ((month === 11 && (day >= 23 && day <= 27))) {
        this.logoImage = '/assets/images/keycraze_logo_thanksgiving.png';
      } else if ((month === 12 && (day >= 1 && day <= 2))) {
        this.logoImage = '/assets/images/keycraze_logo_thanksgiving1.png';
      } else if ((month === 12 && (day >= 10 && day <= 30))) {
        this.logoImage = '/assets/images/keycraze_logo_christmas.png';
      } else {
        this.logoImage = '/assets/images/keycraze_logo.svg';
      }
  
      //this.title.setTitle("Key Craze, Wholesale Key Blanks and Accessories");
      this._getCart();
      this.http.cartUpdates$.subscribe(data=>{
        this.Carttotal= data;
         ///console.log(this.user.customers_id);
      //console.log(this.Carttotal);
      });
     
    }
}
