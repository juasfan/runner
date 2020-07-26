import { NgModule } from '@angular/core';
import { HomePage } from './home.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddPaymentComponent } from './add-payment/add-payment.component';
import { EditPaymentComponent } from './edit-payment/edit-payment.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'add-payment',
    component: AddPaymentComponent,
  },
  {
    path: 'edit-payment/:id',
    component: EditPaymentComponent,
  },
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [HomePage, AddPaymentComponent, EditPaymentComponent],
})
export class HomePageModule {}
