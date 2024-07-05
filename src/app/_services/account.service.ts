import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../../app/_models';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User | null>;
    public user: Observable<User | null>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
        this.user = this.userSubject.asObservable();
    }

    public get userValue() {
        return this.userSubject.value;
    }

    

    logout() {
        debugger
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        return this.http.get(`${environment.apiUrl}/logout`);
        this.router.navigate(['/account/login']);
    }

    register(user: User) {
        return this.http.post(`${environment.apiUrl}/users/register`, user);
    }

    getAll() {
        return this.http.get<User[]>('${environment.apiUrl}/users');
    }

    getById(id: string) {
        return this.http.get<User>('${environment.apiUrl}/users/${id}');
    }

    update(id: string, params: any) {
        return this.http.put(`${environment.apiUrl}/users/${id}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.userValue?.id) {
                    // update local storage
                    const user = { ...this.userValue, ...params };
                    localStorage.setItem('user', JSON.stringify(user));

                    // publish updated user to subscribers
                    this.userSubject.next(user);
                }
                return x;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                if (id == this.userValue?.id) {
                    debugger
                    this.logout();
                }
                return x;
            }));
    }
    select_shpping(shipping: any) {
        return this.http.post(`${environment.apiUrl}/select-shipping`, shipping);
    }
    selectAddress(address: any) {
        return this.http.post(`${environment.apiUrl}/select_address`, {id:address});
    }
    select_payment(payment: any, po_number:any, store:any) {
        let data = {
            payment, 
            po_number,
            store
        }
        return this.http.post(`${environment.apiUrl}/select-payment`, data);
    }
    process_order(payment: any) {
        return this.http.post   (`${environment.apiUrl}/process_order`, {id:payment});
    }

    getAdress() {
        return this.http.get(`${environment.apiUrl}/get_address`);
    }
    
    getCustomerAccount() {
        const getId = localStorage.getItem("user")
        const token =getId?JSON.parse(getId).token:null
        return this.http.get(`${environment.apiUrl}/getCustomerAccount`,{headers:{'Authorization':token}});
    }
    
    get_avalable_shipping_methods() {
        return this.http.get(`${environment.apiUrl}/get_avalable_shipping_methods`);
    }

    getSelectedShippingMethod() {
        return this.http.get(`${environment.apiUrl}/get_selected_shipping_method`);
    }

    getSelectedPaymentMethod() {
        return this.http.get(`${environment.apiUrl}/get_selected_payment_method`);
    }

    getAccountOrders() {
        const getId = localStorage.getItem("user")
        const token =getId?JSON.parse(getId).token:null
        return this.http.get(`${environment.apiUrl}/my_account`,{headers:{'Authorization':token}});
    }

    getCustomerAllAddress() {
        return this.http.get(`${environment.apiUrl}/get_customer_all_address`);
    }
    
    getOrderId() {
        return this.http.get(`${environment.apiUrl}/getOrderId`);
    }
    
    get_states(newValue:any){
        // const payload = { id :newValue }
        return this.http.post(`${environment.apiUrl}/get_states`, newValue);
    }

    deleteAdress(newValue:any){
        return this.http.post(`${environment.apiUrl}/deleteAdress`, {id:newValue});
    }
}