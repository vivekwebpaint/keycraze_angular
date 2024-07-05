import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { AuthGuard } from './_helpers';

import { CartComponent } from './modules/cart/cart.component';
import { CheckoutShippingComponent } from './modules/checkout-shipping/checkout-shipping.component';
import { CheckoutPaymentComponent } from './modules/checkout-payment/checkout-payment.component';
import { CheckoutConfirmationComponent } from './modules/checkout-confirmation/checkout-confirmation.component';

import { AccountComponent } from './modules/account/account.component';
import { AccountHistoryComponent } from './modules/account-history/account-history.component';
import { AccountEditComponent } from './modules/account-edit/account-edit.component';
import { AddressBookComponent } from './modules/address-book/address-book.component';
import { AccountPasswordComponent } from './modules/account-password/account-password.component';
import { AccountNewslettersComponent } from './modules/account-newsletters/account-newsletters.component';
import { AccountBackInStockNotificationsComponent } from './modules/account-back-in-stock-notifications/account-back-in-stock-notifications.component';
import { AccountHistoryViewOrderComponent } from './modules/account-history-view-order/account-history-view-order.component';
import { CheckoutSuccessComponent } from './modules/checkout-success/checkout-success.component';
import { AddressBookProcessComponent } from './modules/address-book-process/address-book-process.component';
import { CheckoutShippingAddressComponent } from './modules/checkout-shipping-address/checkout-shipping-address.component';
import { AddressBookProcessAddComponent } from './modules/address-book-process-add/address-book-process-add.component';
import { OrderHistoryComponent } from './modules/order-history/order-history.component';


const accountModule = () => import('./modules/account/account.module').then(x => x.AccountModule);
const usersModule = () => import('./users/users.module').then(x => x.UsersModule);

const routes: Routes = [
{path: "",  component: HomeComponent, pathMatch: "full"},
//{ path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'users', loadChildren: usersModule, canActivate: [AuthGuard] },
    { path: 'account', loadChildren: accountModule },
    { path: 'cart', component: CartComponent },
    { path: 'checkout_shipping', component: CheckoutShippingComponent, canActivate: [AuthGuard] },
    { path: 'checkout_payment', component: CheckoutPaymentComponent, canActivate: [AuthGuard] },
    { path: 'checkout_confirmation', component: CheckoutConfirmationComponent, canActivate: [AuthGuard] },

    { path: 'my-account', component: AccountComponent, canActivate: [AuthGuard] },
    { path: 'account-history', component: AccountHistoryComponent, canActivate: [AuthGuard] },
    { path: 'account-edit', component: AccountEditComponent, canActivate: [AuthGuard] },
    { path: 'address-book', component: AddressBookComponent, canActivate: [AuthGuard] },
    { path: 'account-password', component: AccountPasswordComponent, canActivate: [AuthGuard] },
    { path: 'account-newsletters', component: AccountNewslettersComponent, canActivate: [AuthGuard] },
    { path: 'account-back-in-stock-notifications', component: AccountBackInStockNotificationsComponent, canActivate: [AuthGuard] },
    { path: 'account-history-view-order/:id', component: AccountHistoryViewOrderComponent, canActivate: [AuthGuard] },
    { path: 'checkout-success', component: CheckoutSuccessComponent, canActivate: [AuthGuard] },
    { path: 'address-book-process/edit/:id', component: AddressBookProcessComponent, canActivate: [AuthGuard] },
    { path: 'address-book-process/add', component: AddressBookProcessAddComponent, canActivate: [AuthGuard] },
    { path: 'checkout-shipping-address', component: CheckoutShippingAddressComponent, canActivate: [AuthGuard] },
    { path: 'order-history', component: OrderHistoryComponent, canActivate: [AuthGuard] },
    // otherwise redirect to home
    //{ path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
