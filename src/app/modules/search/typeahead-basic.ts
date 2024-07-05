import {Component} from '@angular/core';
import {Observable, of, interval, Subject} from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { HttpService } from './../../_services/http.service';
import { Router } from '@angular/router';
import { liveSearch } from './live-search.operator';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'ngbd-typeahead-basic',
  templateUrl: './typeahead-basic.html',
})


export class NgbdTypeaheadBasic {
  show_search_key = true;
  show_search_modal = true;
  cartDetails = new Array<any>();
  notifyMsg: any;
  showNotify = true;
  NotifiedList: any;
  user = JSON.parse(JSON.stringify(this.http.userValue));
  images_Url = environment.images_Url;

  constructor(private httpClient: HttpClient,
              private http: HttpService,
              private router: Router
  ){
    this.router.events.subscribe((event: any) => {
    if (this.router.url.includes('search-keys')){
        this.show_search_key = false;
      }
    })
  }
  public model: any;

  result_list: any;
  products: any;

  search = (text$: Observable<string>) =>
    text$
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(value => this.searchProducts(value)),
        map((products) => products.length < 2 ? [] : products)
      );

  searchProducts(keyword: string): Observable<any> {
    this.show_search_modal = true;
    if(keyword.length >= 2){
      let payload = {keyword};
      this.http.searchProducts(payload).subscribe((data: any) => {
        this.products = JSON.parse(JSON.stringify(data.products));
      });
    }else{
      this.products = Array();
    }
    return of(this.products);
  }

  private productSubject = new Subject<string>();

  readonly productsData$ = this.productSubject.pipe(
    liveSearch(userId => this.http.fetchProducts({keyword:userId}))
  );

  searchPros(userId: any) {
     this.http.getCartItems().subscribe((data: any) => {
      var pids = new Array<any>();
        Object.values(data.products).forEach(function (value: any) {
          pids.push(value.id);
        }); 
        this.cartDetails = pids;
      });

    this.show_search_modal = true;
    if(userId.value.length >= 2){
      this.productSubject.next(userId.value);
    }else{
      this.show_search_modal = false;
    }
    this.getNotifiedList();
  }

  select_result(event:any){
    console.log(event);
    this.show_search_modal = false;
    this.router.navigate(['/search/'+event])
    .then(() => {
      window.location.reload();
    });

  }

  ToArray(str: any){
    var temp = new Array();
    return temp = str.split(",");
  }

   _addItemToCart( id:any, quantity:any): void {
    const box = document.getElementById('searchpid-' + id);
    if (box != null) {
      box.classList.add('product-shadow');
    }

    let payload = {
      productId: id,
      quantity,
    };
    this.http.addToCart(payload);
  }

   //devices = 'one two three'.split(' ');
   select1 = [
    //{ 'key' : '', 'value' : 'Selecy Your Key Machine'},
    { 'key' : 'ilco', 'value' : 'Ilco EZ Clone / RW4 Plus Keys', 'image' : '/assets/images/ilco_bg.png'},
    { 'key' : 'keyline', 'value' : 'Keyline 884 Cloning Keys', 'image' : '/assets/images/884_keyline_bg.png'},
    { 'key' : 'jma', 'value' : 'JMA EVO 5000 Cloning Keys', 'image' : '/assets/images/jma_bg.png'},
    { 'key' : 'ilcobook', 'value' : 'Regular / Onboard Programing Key', 'image' : '/assets/images/book_bg.png'}
    ]

   select2: any;
   select3: any;
   select4: any;
   select5: any;

    keyMachines: string;
    keyMakes = '';
    keyModels = '';
    keyYear = '';

    removaModelSlash(value:any){
      return value.replace('/', "@@");
    }

    onChange(newValue:any) {
        this.http.searchKeys(newValue).subscribe((data: any) => {
          this.select2 = data;
        })
        console.log(newValue);
        this.keyMachines = newValue;
    }

    onMakeChange(key:any, make:any) {
        this.http.searchMakes({key, make}).subscribe((data: any) => {
          this.select3 = data;
        })
        this.keyMakes = make;
    }
     
    onModelChange(key:any, make:any, model:any) {
      console.log(key + make + model);
        this.http.searchModels({key, make, model}).subscribe((data: any) => {
          this.select4 = data;
        })
        console.log(model);
        this.keyModels = model;
    }
     onYearChange(key:any, make:any, model:any, year:any) {
        this.http.searchYear({key, make, model, year}).subscribe((data: any) => {
          this.select5 = data;
          this.router.navigate(['/search-keys/' + key+'/'+this.removaModelSlash(make)+'/'+this.removaModelSlash(model)+'/'+year]);
        }) 
        //console.log(make);
        //this.keyModels = make;
    }
    close_search(){
      this.show_search_modal = false;
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
