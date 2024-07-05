import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '../../../app/_services';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  accountData:any;
  customer_account: any;

  constructor(
          private route: ActivatedRoute,
          private router: Router,
          private accountService: AccountService,
          private title:Title
      ) { }

  ngOnInit() {
    this.title.setTitle('My Account : Key Craze, Wholesale Key Blanks and Accessories');
    this.get_account_orders();
  }

  get_account_orders(){
    this.accountService.getAccountOrders().subscribe((data: any) => {
        this.accountData = data.order_data;
        this.customer_account = data.customer_account.customer_account;
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
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    return a;
  }
}
