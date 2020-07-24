import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import * as moment from 'moment';
import { DecimalPipe } from '@angular/common';
import { IonSlides, NavController } from '@ionic/angular';
import { DailyRecord, HomeService, Payment } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  product_total: number = 0;
  delivery_total: number = 0;
  total: number = 0;

  @ViewChild('daySlides', { static: false }) daySlides: IonSlides;
  days: string[] = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  slideOpts = {
    slidesPerView: 'auto',
    spaceBetween: 16,
  };

  constructor(
    private navController: NavController,
    private localStorage: LocalStorageService,
    private homeService: HomeService
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    this.records = await this.localStorage.getItem('records');
    this.total = this.product_total = this.delivery_total = 0;

    this.records.forEach((record) => {
      this.product_total += record.product;
      this.delivery_total += record.delivery;
      this.total += record.total;
    });
  }

  formatDate(date: Date): string {
    const data = moment(date).calendar();

    if (data.includes('Today')) {
      return 'Today';
    } else if (data.includes('Yesterday')) {
      return 'Yesterday';
    } else {
      return moment(date).format('dddd - MMMM Do');
    }
  }

  formatPrice(price: number): string {
    return 'RM' + new DecimalPipe('en-US').transform(price, '1.2-2');
  }

  todayDate(): string {
    return moment().format('MMMM Do');
  }

  add() {
    this.navController.navigateForward('home/form');
  }

  edit(record: DailyRecord, payment: Payment) {
    // this.homeService.selectedRecord = record;
    // this.homeService.selectedPayment = payment;
    // this.navController.navigateForward('home/edit');
  }

  records: DailyRecord[] = [];
}
