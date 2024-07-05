import { Component, OnInit, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpService } from '../../_services/http.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
@Injectable({providedIn:'root'})

export class OrderHistoryComponent  implements OnInit {
  p: number = 1;
  cart_quantity = new Array<any>();
  event = '';
  title = 'Product List';
  products = new Array<any>();
  categories: any;
  subcategories = new Array<any>();
  count: number = 1;
  errorMessage = '';
  cartDetails = new Array<any>();
  Carttotal:number = 0;
  notifyMsg: any;
  showNotify = true;
  NotifiedList= new Array<any>();

  user = JSON.parse(JSON.stringify(this.http.userValue));
  images_Url = environment.images_Url;

  constructor(private httpClient: HttpClient,
        private router: RouterModule,
        public activatedRoute: ActivatedRoute,
        private http: HttpService){
  }

  ngOnInit(event=1){
    this.http.user.subscribe(x => this.user = x);

    this.http.getCartItems().subscribe((data: any) => {
        //this.cartDetails = data.products;
      var pids = new Array<any>();
        Object.values(data.products).forEach(function (value: any) {
          pids.push(value.id);
        }); 
        this.cartDetails = pids;
      });
      this.httpClient.post<any>(environment.apiUrl+'/order-history', { limit: '40', currentPage: event }).subscribe({
        next: data => {
                this.products = JSON.parse(JSON.stringify(data.products));
                this.count = JSON.parse(JSON.stringify(data.count));
            },
        error: error => {
            this.errorMessage = error.message;
            console.error('There was an error!', error);
        }
     });
      this.http.cartUpdates$.subscribe(()=>{
        this.Carttotal= this.http.Carttotal;
      });
      this.getNotifiedList();
  }

 getNotifiedList(){
    this.httpClient.get<any>(environment.apiUrl+'/notified-list')
    .subscribe({
      next: data => {
          this.NotifiedList = data;
      }
    })
  }

  pageChanged(event: any) {
    this.ngOnInit(event);
    //this.event = event.target.value;
  }

  ToArray(str: any){
    var temp = new Array();
    // This will return an array with strings "1", "2", etc.
    return temp = str.split(",");
  }
  
  ConvertString(value: any){
    return parseFloat(value)
  }
   _addItemToCart( id:any, quantity:any): void {
    const box = document.getElementById('pid-' + id);
    if (box != null) {
    box.classList.add('product-shadow');
  }

    let payload = {
      productId: id,
      quantity,
    };
    this.http.addToCart(payload);
  }
  notifyMe(products_id: any, products_model: any){
    let payload = {
        product_id: products_id,
        name: products_model
      };
    this.http.notifyMe(payload).subscribe((data: any) => {
      this.notifyMsg = {'product_id': products_id, 'msg': 'You have been successfully subscribed to the Back In Stock Notification List.'}
      this.showNotify = false;
    });
  }
  trackByIndex(index: number, obj: any): any {
    return index;
  }
}