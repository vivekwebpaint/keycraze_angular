import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-account-history',
  templateUrl: './account-history.component.html',
  styleUrls: ['./account-history.component.css']
})
export class AccountHistoryComponent {
  history_data:any;
  p: number = 1;
  count = '';
  constructor(
        private http: HttpClient
    ) { }

  ngOnInit(event=1) {
        this.account_history(event);
  }

  account_history(event=1){
    return this.http.post(`${environment.apiUrl}/account_history`, { limit: '10', currentPage: event }).subscribe((data: any) => {
        this.history_data = data;
        this.count = data.count;
    });
  }

  pageChanged(event: any) {
    this.ngOnInit(event);
    //this.event = event.target.value;
  }

  ConvertString(value: any){
    return parseFloat(value)
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
