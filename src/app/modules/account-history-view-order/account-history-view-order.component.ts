import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../_services/http.service';

@Component({
  selector: 'app-account-history-view-order',
  templateUrl: './account-history-view-order.component.html',
  styleUrls: ['./account-history-view-order.component.css']
})
export class AccountHistoryViewOrderComponent {
  order_id:any;
  history_data:any;
  order_data:any;
  product_data:any;
  orders_total:any;
  cartDetails = new Array<any>();
  images_Url = environment.images_Url;
  
  constructor(
        private http: HttpClient,
        public activatedRoute: ActivatedRoute,
        private https: HttpService
    ) { }

  ngOnInit() {
      this.https.getCartItems().subscribe((data: any) => {
        //this.cartDetails = data.products;
      var pids = new Array<any>();
        Object.values(data.products).forEach(function (value: any) {
          pids.push(value.id);
        }); 
        this.cartDetails = pids;
      });
      this.account_history_view();
  }

  account_history_view(){
    var order_id = this.activatedRoute.snapshot.url[1].path;
    return this.http.post(`${environment.apiUrl}/account_history_view`, { orderId: order_id }).subscribe((data: any) => {
        this.history_data = data.account_history;
        this.order_data = data.order_data;
        this.product_data = data.product_data;
        this.orders_total = data.orders_total;
    });
  }

  date_format(dated:any){
    let MySQLDate = dated;
    // format the date string
    let date = MySQLDate.replace( /[-]/g, '/' );
    // parse the proper date string from the formatted string.
    date = Date.parse( date );
    // create new date
    let jsDate = new Date( date );

    let a = jsDate.toLocaleString('en', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    return a;
  }
   _addItemToCart( id:any, quantity:any, price=null): void {
    const box = document.getElementById('pid-' + id);
    if (box != null) {
      box.classList.add('shadow-sm');
    }

      let payload = {
        productId: id,
        quantity,
        price
      };
      this.https.addToCart(payload);
  }
}
