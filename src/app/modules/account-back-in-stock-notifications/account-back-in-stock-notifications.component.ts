import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../_services/http.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-account-back-in-stock-notifications',
  templateUrl: './account-back-in-stock-notifications.component.html',
  styleUrls: ['./account-back-in-stock-notifications.component.css']
})

export class AccountBackInStockNotificationsComponent {
  form!: FormGroup;
    loading = false;
    submitted = false;

  product_data:any;
  cartDetails = new Array<any>();
  images_Url = environment.images_Url;

  constructor(
        private http: HttpClient,
        public activatedRoute: ActivatedRoute,
        private formBuilder: FormBuilder,
        private https: HttpService
    ) { 
     this.form = this.formBuilder.group({
        checkArray: this.formBuilder.array([], [Validators.required]),
      });
  }

  ngOnInit() {
      this.https.getCartItems().subscribe((data: any) => {
        //this.cartDetails = data.products;
      var pids = new Array<any>();
        Object.values(data.products).forEach(function (value: any) {
          pids.push(value.id);
        }); 
        this.cartDetails = pids;
      });
      this.back_in_stock_notification();
     
  }

  onCheckboxChange(e: any) {
    const checkArray: FormArray = this.form.get('checkArray') as FormArray;
    if (!e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: any) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

   onSubmit() {
        this.submitted = true;
        //this.alertService.clear();
        if (this.form.invalid) {
            return;
        }
        this.loading = true;
        return this.http.post(`${environment.apiUrl}/back_in_stock_notification_update`, this.form.value).subscribe((data: any) => {
          this.back_in_stock_notification();
      });
    }

  back_in_stock_notification(){
    return this.http.get(`${environment.apiUrl}/back_in_stock_notification`).subscribe((data: any) => {
        this.product_data = data;
    });
  }

  ToArray(str: any){
    var temp = new Array();
    // This will return an array with strings "1", "2", etc.
    return temp = str.split(",");
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
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    return a;
  }
   _addItemToCart( id:any, quantity:any): void {
    const box = document.getElementById('pid-' + id);
    if (box != null) {
      box.classList.add('shadow-sm');
    }

      let payload = {
        productId: id,
        quantity,
      };
      this.https.addToCart(payload);
  }
}
