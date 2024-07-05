import { Component, OnInit, Injectable, ElementRef, Inject, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { DomSanitizer, Title, Meta } from '@angular/platform-browser';
import { HttpService } from '../../_services/http.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-product',
  templateUrl: './template/product.list.html',
  styleUrls: ['./product.component.css']
})
@Injectable({providedIn:'root'})


export class ProductComponent implements OnInit {
  p: number = 1;
  cart_quantity = new Array<any>();
  event = '';
  products = new Array<any>();
  categories: any;
  metaTags = { metatags_description: '', metatags_keywords: '', metatags_title: ''};
  subcategories = new Array<any>();
  count: number = 1;
  errorMessage = '';
  category_id = '';
  cartDetails = new Array<any>();
  Carttotal:number = 0;
  notifyMsg: any;
  showNotify = true;
  NotifiedList: any;
  images_Url = environment.images_Url;
  user = JSON.parse(JSON.stringify(this.http.userValue));

  constructor(private httpClient: HttpClient,
        private router: RouterModule,
        public activatedRoute: ActivatedRoute,
        private http: HttpService,
        private title:Title,
        private meta:Meta,
        private renderer: Renderer2,
        private el: ElementRef,
        @Inject(DOCUMENT) private document: Document
        ){}


  scrollToTop(duration: number): void {
    const startScroll = this.document.documentElement.scrollTop || this.document.body.scrollTop;
    const targetScroll = 0; // Scroll to the top of the page
    const distance = targetScroll - startScroll;
    const startTime = performance.now();

    const easeInOutQuad = (t: number): number => {
      t /= duration / 2;
      if (t < 1) return distance / 2 * t * t + startScroll;
      t--;
      return -distance / 2 * (t * (t - 2) - 1) + startScroll;
    };

    const animateScroll = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      this.document.documentElement.scrollTop = easeInOutQuad(elapsedTime);
      this.document.body.scrollTop = easeInOutQuad(elapsedTime);

      if (elapsedTime < duration) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  }
  id: string;
  ngOnInit(event=1){
    this.http.user.subscribe(x => this.user = x);
    var category_id = this.activatedRoute.snapshot.url[1].path;
    this.activatedRoute.params.subscribe(params => {
      var category_id = params['id'];
      //console.log(category_id);
      // Do something with the id
    
    this.http.getCartItems().subscribe((data: any) => {
        //this.cartDetails = data.products;
      var pids = new Array<any>();
        Object.values(data.products).forEach(function (value: any) {
          pids.push(value.id);
        }); 
        this.cartDetails = pids;
      });
      this.httpClient.post<any>(environment.apiUrl+'/products-list', { limit: '40', category_id: category_id, currentPage: event }).subscribe({
        next: data => {
                this.products = JSON.parse(JSON.stringify(data.products));
                this.count = JSON.parse(JSON.stringify(data.count));
                this.categories = JSON.parse(JSON.stringify(data.categories));  
                this.metaTags = data.metaTags;
                if(this.metaTags == null){
                  this.title.setTitle(this.categories.categories_name + ' : Key Craze, Wholesale Key Blanks and Accessories');
                }else{
                  this.title.setTitle(this.metaTags.metatags_title);
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
    });
      this.http.cartUpdates$.subscribe(()=>{
        this.Carttotal= this.http.Carttotal;
      });
      this.getSubCategories();
      this.getNotifiedList();
  }


  getSubCategories(){
    var category_id = this.activatedRoute.snapshot.url[1].path;
    this.httpClient.post<any>(environment.apiUrl+'/subcategories-list', { category_id: category_id })
    .subscribe({
      next: data => {
          this.subcategories = data;
      }
    })
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
    this.scrollToTop(300);
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
   _addItemToCart( id:any, quantity:any, price=null): void {
    const box = document.getElementById('pid-' + id);
    if (box != null) {
    box.classList.add('product-shadow');
  }

    let payload = {
      productId: id,
      quantity,
      price
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