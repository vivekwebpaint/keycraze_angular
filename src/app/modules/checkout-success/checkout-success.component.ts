import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '../../../app/_services';
import { Subject, Observable, BehaviorSubject }    from 'rxjs';
import { HttpService } from '../../_services/http.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-checkout-success',
  templateUrl: './checkout-success.component.html',
  styleUrls: ['./checkout-success.component.css']
})
export class CheckoutSuccessComponent implements OnInit {
private cartUpdates = new Subject<string>();
public cartUpdates$ = this.cartUpdates.asObservable();

OrderId:any;

  constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService,
        private http: HttpService,
        private title:Title
    ) { }

  ngOnInit() {
        this.title.setTitle('Thank You! We Appreciate your Business! : Key Craze, Wholesale Key Blanks and Accessories');
        this.get_order_id();
        this.http.cartUpdates.next('0');
  }

  get_order_id(){
    this.accountService.getOrderId().subscribe((data: any) => {
        this.OrderId = data;
    });
  }

}
