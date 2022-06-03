import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CustomersComponent} from "./customers/customers.component";
import {AccountsComponent} from "./accounts/accounts.component";
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./auth.guard";
import {CustomerAccountsComponent} from "./customer-accounts/customer-accounts.component";
import {NewCustomerComponent} from "./new-customer/new-customer.component";

const routes: Routes = [
  {path : "customers", component : CustomersComponent},
  { path :"accounts", component : AccountsComponent},
  { path :"new-customer", component : NewCustomerComponent,canActivate: [AuthGuard],
    data: {
      role: 'SUPER_ADMIN'
    }},
  { path :"customer-accounts/:id", component : CustomerAccountsComponent,canActivate: [AuthGuard],
    data: {
      role: 'ADMIN'
    }},
  {path : "accounts", component : AccountsComponent,canActivate: [AuthGuard],
    data: {
      role: 'USER'
    }},
  {path : "login", component : LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
