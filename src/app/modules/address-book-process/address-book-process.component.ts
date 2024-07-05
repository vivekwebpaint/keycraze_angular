import { Component, OnInit } from '@angular/core'; 
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '../../../app/_services';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-address-book-process',
  templateUrl: './address-book-process.component.html',
  styleUrls: ['./address-book-process.component.css']
})
export class AddressBookProcessComponent implements OnInit {
addressData : any;
primaryAddressData : any;
entry_country_id: any;
stateData: any;

form!: FormGroup;
    loading = false;
    submitted = false;
    data: any;
    address_id:Object = {};
    constructor(
        private http: HttpClient,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.get_address();
        this.form = this.formBuilder.group({
            entry_firstname: ['', Validators.required],
            entry_lastname: ['', Validators.required],
            entry_company: ['', Validators.required],
            entry_street_address: ['', Validators.required],
            entry_suburb: ['', Validators.required],
            entry_city: ['', Validators.required],
            entry_zone_id: ['', Validators.required],
            entry_postcode: ['', Validators.required],
            entry_country_id: ['', Validators.required],
            primary_address: ['']
        });
  }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    get_address(){
      var address_id = this.route.snapshot.url[2].path;
        this.http.post(`${environment.apiUrl}/getAddressById`,{id:address_id} ).subscribe((data: any) => {
          this.primaryAddressData = data;
          this.onCountryChange(data.entry_country_id);
          this.form = this.formBuilder.group({
                entry_firstname: [this.primaryAddressData.entry_firstname],
                entry_lastname: [this.primaryAddressData.entry_lastname],
                entry_company: [this.primaryAddressData.entry_company],
                entry_street_address: [this.primaryAddressData.entry_street_address],
                entry_suburb: [this.primaryAddressData.entry_suburb],
                entry_city: [this.primaryAddressData.entry_city],
                entry_zone_id: [this.primaryAddressData.entry_zone_id],
                entry_postcode: [this.primaryAddressData.entry_postcode],
                entry_country_id: [this.primaryAddressData.entry_country_id],
                primary_address: [this.primaryAddressData.primary_address]
           });
        })
    }

    onCountryChange(newValue:any) {
        this.http.post(`${environment.apiUrl}/get_states`, {id:newValue}).subscribe((data: any) => {
          this.stateData = data;
        })
        console.log(newValue);
        //this.keyMachines = newValue;
    }

    onSubmit(){
        this.submitted = true;
            // reset alerts on submit
            this.alertService.clear();
            // stop here if form is invalid
            if (this.form.invalid) {
                return;
            }
            this.loading = true;
        this.form.value['address_id'] = this.route.snapshot.url[2].path;
        return this.http.post(`${environment.apiUrl}/address_update`, this.form.value).subscribe((data: any) => {
          if(data.error){
            this.alertService.error('an error occured');
            this.loading = false;
          }else{
            this.alertService.success('Your Address has been successfully updated.', { keepAfterRouteChange: true });
            this.loading = false;
            const returnUrl =  '/address-book';
            this.router.navigate([returnUrl], { relativeTo: this.route });
            window.scrollTo(0, 0)
            //window.location.reload();
          }
          
        });
    }
}