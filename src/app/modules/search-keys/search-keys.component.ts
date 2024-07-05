import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import {KeyValue} from '@angular/common';
import { HttpService } from '../../_services/http.service';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-search-keys',
  templateUrl: './search-keys.component.html',
  styleUrls: ['./search-keys.component.css']
})
export class SearchKeysComponent {
  searchData: any;
  products: any;
  headers:any;
  cartDetails = new Array<any>();
  images_Url = environment.images_Url;
  
  public keepOriginalOrder(_left: KeyValue<any, any>, _right: KeyValue<any, any>): number {
    return -1;
  }
  constructor(
        private http: HttpClient,
        public activatedRoute: ActivatedRoute,
        public https: HttpService,
        private router: Router
    ) { }

  ngOnInit() {
        this.SearchKeysView();
        this.https.getCartItems().subscribe((data: any) => {
        //this.cartDetails = data.products;
      var pids = new Array<any>();
        Object.values(data.products).forEach(function (value: any) {
          pids.push(value.id);
        }); 
        this.cartDetails = pids;
      });
  }

  SearchKeysView(){
    var key = this.activatedRoute.snapshot.url[1].path;
    var make = this.activatedRoute.snapshot.url[2].path;
    var model = this.activatedRoute.snapshot.url[3].path;
    var year = this.activatedRoute.snapshot.url[4].path;
    return this.http.post(`${environment.apiUrl}/searchYear`, { key: key, make: make, model: model, year: year }).subscribe((data: any) => {
      this.searchData = data.searchData;
      this.products = data.products;
      this.headers = Object.keys(data.searchData[0]);
    });
  }

  convertToObject(values:any){
    return Object.values(values);
  }

  removaSpecialChars(value:any){
    var re = /_/gi;
    var re2 = /NO SEARCH/gi;
    value = value.replace(re, " ");
    return value.replace(re2, " ");
  }

  removaModelSlash(value:any){
    return value.replace('/', "@@");
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
    this.https.addToCart(payload);
  }

  select1 = [
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
    onChange(newValue:any) {
        this.https.searchKeys(newValue).subscribe((data: any) => {
          this.select2 = data;
        })
        console.log(newValue);
        this.keyMachines = newValue;
    }

    onMakeChange(key:any, make:any) {
        this.https.searchMakes({key, make}).subscribe((data: any) => {
          this.select3 = data;
        })
        this.keyMakes = make;
    }
     
    onModelChange(key:any, make:any, model:any) {
      console.log(key + make + model);
        this.https.searchModels({key, make, model}).subscribe((data: any) => {
          this.select4 = data;
        })
        console.log(model);
        this.keyModels = model;
    }
     onYearChange(key:any, make:any, model:any, year:any) {
        this.https.searchYear({key, make, model, year}).subscribe((data: any) => {
          this.searchData = data.searchData;
          this.products = data.products;
          this.headers = Object.keys(data.searchData[0]);
          this.router.navigate(['/search-keys/' + key+'/'+this.removaModelSlash(make)+'/'+this.removaModelSlash(model)+'/'+year]);
        })
        //console.log(make);
        //this.keyModels = make;
    }

}
