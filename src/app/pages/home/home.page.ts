import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Payment, RecordService } from 'src/app/shared/services/record.service';
import * as moment from 'moment';
import { DecimalPipe } from '@angular/common';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  delivery_total: number;
  product_total: number;
  total: number;

  records: DailyRecord[] = [];

  constructor(
    private navCtrl: NavController,
    private recordService: RecordService
  ) {}

  async ngOnInit() {}

  async ionViewWillEnter() {
    let data = await this.recordService.getRecords();
    this.delivery_total = 0;
    this.product_total = 0;
    this.total = 0;

    if (data) {
      data.forEach(({ delivery, product, total }) => {
        this.delivery_total += delivery;
        this.product_total += product ? product : 0;
        this.total += total;
      });

      this.records = this.groupBy(data);
    }
  }

  groupBy(data: Payment[]): DailyRecord[] {
    const dates = [...new Set(data.map((payment) => payment.date))];

    return dates.map((date) => {
      let paymentsByDate = data.filter((val) => val.date === date);
      const record = {
        date: date,
        payments: paymentsByDate,
      };

      return record;
    });
  }

  addPayment() {
    this.navCtrl.navigateForward('home/add-payment');
  }

  editPayment(id: string) {
    this.navCtrl.navigateForward(`home/edit-payment/${id}`);
  }

  formatDate(date: string): string {
    const data = moment(date, 'YYYYMMDD').calendar();

    if (data.includes('Today')) {
      return 'Today';
    } else if (data.includes('Yesterday')) {
      return 'Yesterday';
    } else {
      return moment(date).format('dddd - MMMM Do');
    }
  }

  formatPrice(price: number): string {
    return price === 0
      ? '0'
      : 'RM' + new DecimalPipe('en-US').transform(price, '1.2-2');
  }

  todayDate(): string {
    return moment().format('MMMM Do');
  }
}

export interface DailyRecord {
  date: string;
  payments: Payment[];
}
