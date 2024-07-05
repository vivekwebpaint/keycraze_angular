import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule, PathLocationStrategy, LocationStrategy, NgOptimizedImage } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { AppComponent } from './modules/common/app.component';
import { ProductComponent } from './modules/product/product.component';
import { OutofstockComponent } from './modules/outofstock/outofstock.component';
import { HomeComponent } from './modules/home/home.component';
import { ProductDetailsComponent } from './modules/product-details/product-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { HttpRequestInterceptor } from './_helpers/HttpRequestInterceptor';
import { AlertComponent } from './modules/alert';
import { SafeHTMLPipe } from './pipes/safe-html.pipe';
import { explodePipe } from './pipes/explode.pipe';
import { ObjectToArrayPipe } from './pipes/object-array.pipe';

import { CartComponent } from './modules/cart/cart.component';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdTypeaheadBasic } from './modules/search/typeahead-basic';
import { CheckoutShippingComponent } from './modules/checkout-shipping/checkout-shipping.component';
import { CheckoutPaymentComponent } from './modules/checkout-payment/checkout-payment.component';
import { PasswordForgottenComponent } from './modules/password-forgotten/password-forgotten.component';
import { CheckoutConfirmationComponent } from './modules/checkout-confirmation/checkout-confirmation.component';
import { AccountHistoryComponent } from './modules/account-history/account-history.component';
import { AccountEditComponent } from './modules/account-edit/account-edit.component';
import { AddressBookComponent } from './modules/address-book/address-book.component';
import { AccountPasswordComponent } from './modules/account-password/account-password.component';
import { AccountNewslettersComponent } from './modules/account-newsletters/account-newsletters.component';
import { AccountBackInStockNotificationsComponent } from './modules/account-back-in-stock-notifications/account-back-in-stock-notifications.component';
import { AccountHistoryViewOrderComponent } from './modules/account-history-view-order/account-history-view-order.component';
import { CheckoutSuccessComponent } from './modules/checkout-success/checkout-success.component';
import { AddressBookProcessComponent } from './modules/address-book-process/address-book-process.component';
import { AddressBookProcessAddComponent } from './modules/address-book-process-add/address-book-process-add.component';
import { AboutUsComponent } from './modules/about-us/about-us.component';
import { TermOfUseComponent } from './modules/term-of-use/term-of-use.component';
import { PrivacyPolicyComponent } from './modules/privacy-policy/privacy-policy.component';
import { ContactUsComponent } from './modules/contact-us/contact-us.component';
import { CheckoutShippingAddressComponent } from './modules/checkout-shipping-address/checkout-shipping-address.component';
import { SearchKeysComponent } from './modules/search-keys/search-keys.component';
import { SearchResult } from './modules/search/search-result';

import { NgSelectModule } from '@ng-select/ng-select';
import { OrderHistoryComponent } from './modules/order-history/order-history.component';
import { ExpandMenu } from './modules/common/expand-menu.directive';

import { LoadingIndicatorService } from './_services/LoadingIndicatorService';
import { LoadingInterceptorService } from './_services/LoadingInterceptorService';
import { CircleSpinner } from './modules/common/circleSpinner';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProductComponent,
    OutofstockComponent,
    CartComponent,
    ProductDetailsComponent,
    AlertComponent,
    SafeHTMLPipe,
    explodePipe,
    ObjectToArrayPipe,
    NgbdTypeaheadBasic,
    CheckoutShippingComponent,
    CheckoutPaymentComponent,
    PasswordForgottenComponent,
    CheckoutConfirmationComponent,
    AccountHistoryComponent,
    AccountEditComponent,
    AddressBookComponent,
    AccountPasswordComponent,
    AccountNewslettersComponent,
    AccountBackInStockNotificationsComponent,
    AccountHistoryViewOrderComponent,
    CheckoutSuccessComponent,
    AddressBookProcessComponent,
    AddressBookProcessAddComponent,
    AboutUsComponent,
    TermOfUseComponent,
    PrivacyPolicyComponent,
    ContactUsComponent,
    CheckoutShippingAddressComponent,
    SearchKeysComponent,
    SearchResult,
    OrderHistoryComponent,
    ExpandMenu,
    CircleSpinner,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTypeaheadModule,
    NgSelectModule,
    NgOptimizedImage,
    RouterModule.forRoot([
      {path: 'product', component: ProductComponent},
      {path: 'outofstock', component: OutofstockComponent},
      {path: 'home', component: HomeComponent },
    ]),
     RouterModule.forChild([
      {path: 'category/:id', component: ProductComponent},
      {path: 'cpath/:id', component: ProductComponent},
      {path: 'product/:id',component: ProductDetailsComponent},
      {path: 'search-keys/:id/:id/:id/:id',component: SearchKeysComponent},
      {path: 'contact-us',component: ContactUsComponent},
      {path: 'privacy-policy',component: PrivacyPolicyComponent},
      {path: 'term-of-use-policy',component: TermOfUseComponent},
      {path: 'about-us',component: AboutUsComponent},
      {path: 'search/:id',component: SearchResult},
      {path: 'password-forgotten',component: PasswordForgottenComponent}
    ]),
  ],
   providers: [
        LoadingIndicatorService,
        {
          provide: HTTP_INTERCEPTORS,
          useFactory: (service: LoadingIndicatorService) => new LoadingInterceptorService(service),
          multi: true,
          deps: [LoadingIndicatorService]
        },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
