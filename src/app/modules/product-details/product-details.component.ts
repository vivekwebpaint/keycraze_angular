import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../_services/http.service';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-product-details',
  templateUrl: './template/product-details.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent {

  product_id = '';
  products = new Array<any>();
  additional_images = new Array<any>();
  also_purchased = new Array<any>();
  cart_quantity = new Array<any>();
  cartDetails = new Array<any>();
  Carttotal:number = 0;
  errorMessage = '';
  notifyMsg: any;
  user = JSON.parse(JSON.stringify(this.http.userValue));
  showNotify = true;
  NotifiedList: any;
  metaTags: any;
  images_Url = environment.images_Url;

  constructor(private httpClient: HttpClient,
        public activatedRoute: ActivatedRoute,
        private http: HttpService,
        private title:Title,
        private meta:Meta){
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

    var product_id = this.activatedRoute.snapshot.url[1].path;
      this.httpClient.post<any>(environment.apiUrl+'/product-details', { product_id:product_id }).subscribe({
        next: data => {
                this.products = JSON.parse(JSON.stringify(data.products));
                this.additional_images = JSON.parse(JSON.stringify(data.additional_images));
                this.metaTags = data.metaTags;
                this.title.setTitle(this.products[0].products_name + ' ['+ this.products[0].products_model+'] - $'+parseFloat(this.products[0].products_price)+' : Key Craze, Wholesale Key Blanks and Accessories');
                if(this.metaTags){
                  this.meta.addTags([ 
                      { name: 'description', content: this.metaTags.metatags_description }, 
                      { name: 'keywords', content: this.metaTags.metatags_keywords } 
                  ]);
                }
            },
        error: error => {
            this.errorMessage = error.message;
            console.error('There was an error!', error);
        }
     });

      this.httpClient.post<any>(environment.apiUrl+'/also_purchased', { product_id:product_id }).subscribe({
        next: data => {
                this.also_purchased = JSON.parse(JSON.stringify(data.also_purchased));
            },
        error: error => {
            this.errorMessage = error.message;
            console.error('There was an error!', error);
        }
     });
      //this.http.cartUpdates$.subscribe(()=>{
      //  this.Carttotal= this.http.Carttotal;
      //});
      this.getNotifiedList();
  }
  ToArray(str: any){
    var temp = new Array();
    // This will return an array with strings "1", "2", etc.
    return temp = str.split(",");
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

  getNotifiedList(){
    this.httpClient.get<any>(environment.apiUrl+'/notified-list')
    .subscribe({
      next: data => {
          this.NotifiedList = data;
      }
    })
  }

}
