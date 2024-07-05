import { Component, OnInit, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { DomSanitizer, Title, Meta } from '@angular/platform-browser';
import { HttpService } from '../../_services/http.service';


@Component({
  selector: 'app-outofstock',
  templateUrl: './template/outofstock.list.html',
})
@Injectable({providedIn:'root'})

export class OutofstockComponent implements OnInit {
  p: number = 1;
  event = '';
  products = new Array<any>();
  count: number = 1;
  errorMessage = '';
  itemsPerPage = 40;
  images_Url = environment.images_Url;
  sortValue = 'shop_products.products_sort_order';

  constructor(private httpClient: HttpClient,
        private router: RouterModule,
        public activatedRoute: ActivatedRoute,
        private http: HttpService,
        private title:Title,
        private meta:Meta
        ){}

  ngOnInit(event=1, sortBy = this.sortValue){
      this.httpClient.post<any>(environment.apiUrl+'/outofstock', { limit: '40', currentPage: event, orderBy:  sortBy }).subscribe({
        next: data => {
                this.products = JSON.parse(JSON.stringify(data.products));
                this.count = JSON.parse(JSON.stringify(data.count));
                this.itemsPerPage = 40;
            },
        error: error => {
            this.errorMessage = error.message;
            console.error('There was an error!', error);
        }
     });
  }

  sortby(event=1, sortBy: any){
    this.httpClient.post<any>(environment.apiUrl+'/outofstock', { limit: '40', currentPage: event, orderBy:  sortBy}).subscribe({
        next: data => {
                this.products = JSON.parse(JSON.stringify(data.products));
                this.count = JSON.parse(JSON.stringify(data.count));
            },
        error: error => {
            this.errorMessage = error.message;
            console.error('There was an error!', error);
        }
     });
  }

  searchProducts(value: any){
    if(value == ''){
      this.ngOnInit(1, this.sortValue);
    }
    this.httpClient.post<any>(environment.apiUrl+'/outofstocksearch', { search_key:  value}).subscribe({
        next: data => {
                this.products = JSON.parse(JSON.stringify(data.products));
                this.count = JSON.parse(JSON.stringify(data.count));
                this.itemsPerPage = 500;
            },
        error: error => {
            this.errorMessage = error.message;
            console.error('There was an error!', error);
        }
     });
  }

  pageChanged(event: any, sortBy = this.sortValue) { 
    this.ngOnInit(event, sortBy);
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
  trackByIndex(index: number, obj: any): any {
    return index;
  }
}