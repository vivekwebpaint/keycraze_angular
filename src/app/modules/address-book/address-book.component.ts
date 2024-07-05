import { Component, OnInit } from '@angular/core'; 
import { AccountService, AlertService } from '../../../app/_services';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.component.html',
  styleUrls: ['./address-book.component.css']
})
export class AddressBookComponent implements OnInit {
addressData : any;
primaryAddressData : any;   
data: any;

    constructor(
        private http: HttpClient,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.get_customer_all_address();
        this.get_address();
  }

    get_customer_all_address(){
        this.accountService.getCustomerAllAddress().subscribe((data: any) => {
            this.addressData = data;
        });
    }

    get_address(){
        this.accountService.getAdress().subscribe((data: any) => {
            this.primaryAddressData = data;
        });
    }
    delete_address(address_book_id: any){
        this.accountService.deleteAdress(address_book_id).subscribe((data: any) => {
            this.ngOnInit();
        });
    }
}