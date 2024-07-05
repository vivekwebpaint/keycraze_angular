import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Subject, Observable, BehaviorSubject, of }    from 'rxjs';
import { AccountService } from './../_services';
import { User } from '../../app/_models';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  public cartUpdates = new Subject<string>();
  public cartUpdates$ = this.cartUpdates.asObservable();
  public cartItems = 0;
  payload = 0;

  //user = JSON.parse(JSON.stringify(this.accountService.userValue));

  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;

  constructor(private http: HttpClient, private router: Router) {
    this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
    this.user = this.userSubject.asObservable();
  }

  public get userValue() {
      return this.userSubject.value;
  }

  getAllProducts() {
    return this.http.get(`${environment.apiUrl}/product`);
  }

  addToCart(payload: any) {
    var price = this.formatPrice(payload.quantity);
    if(price){
      payload['price'] = price;
    }
    payload['quantity'] = this.formatQuantity(payload.quantity);
    if(this.userValue){
      payload['customers_id'] = this.userValue.customers_id;
    }
    return this.http.post(`${environment.apiUrl}/addtocart`, payload).subscribe((data: any) => {
      this.cartItems = data.total;
      this.cartUpdates.next(data.total);
    });
  }

  formatPrice(price: any){
    var formattedPrice = price.match(/(\d[\d\.]*)/g);
    if(formattedPrice.length > 1){
      if(price.includes('¢') || price.includes('&cent;')) {
        price = (parseInt(formattedPrice[1])/100);
      }else{
        price = formattedPrice[1];
      }
      return price;
    }else{
      return null;
    }
  }

  formatQuantity(qty: any){
    var qty = qty.match(/(\d[\d\.]*)/g);
    return qty[0];
  }

  notifyMe(payload: any) {
    return this.http.post(`${environment.apiUrl}/notifyMe`, payload);
  }

  searchProducts(payload: any) {
    return this.http.post(`${environment.apiUrl}/search_products`, payload);
  }

  fetchProducts(payload: any) {
    return this.http.post<any>(`${environment.apiUrl}/search_products`, payload);
  } 

  getCartItems() {
    const getId = localStorage.getItem("user")
  const token =getId?JSON.parse(getId).token:null
    return this.http.get(`${environment.apiUrl}/cart?url=${this.router.url}`,{headers:{'Authorization':token}});
  }
  increaseQty(payload: any) {
    return this.http.post(`${environment.apiUrl}/UpdateCart`, payload);
  }
  decreaseQty(payload: any) {
    return this.http.post(`${environment.apiUrl}/removeFromCart`, payload);
  }
  emptyCart() {
     this.cartUpdates.next('0');
    return this.http.delete(`${environment.apiUrl}/cart/empty-cart`);
  }
   public get Carttotal():number{
    return this.cartItems;    
  };
  login(email: string, password: string) {
    return this.http.post<User>(environment.apiUrl+'/SigninController/loginAuth', { email, password })
      .pipe(map((user:any) => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
          this.cartUpdates.next(user.cart_total);
          localStorage.setItem('user', JSON.stringify(user));
          console.log(user.token)
          this.userSubject.next(user);
          return user;
      }));
  }

  loginAfterRegister(user: any){
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
    return user;
  }

  reset_password(email: string,) {
    return this.http.post<User>(environment.apiUrl+'/SigninController/resetPassword', { email });
  }

  logout() {
        // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    this.userSubject.next(null);
    return this.http.get(`${environment.apiUrl}/logout`);
  }

  searchKeys(payload: any) {
    // debugger
    const payloads = { key: payload }; 
    return this.http.post(`${environment.apiUrl}/searchKeys`, payloads);
  }
  
  searchMakes(payload: any) {
    return this.http.post(`${environment.apiUrl}/searchMakes`, payload);
  }
  searchModels(payload: any) {
    return this.http.post(`${environment.apiUrl}/searchModels`, payload);
  }
  searchYear(payload: any) {
    return this.http.post(`${environment.apiUrl}/searchYear`, payload);
  }

  expressCheckout(){
    return this.http.get(`${environment.apiUrl}/expressCheckout`);
  }

}