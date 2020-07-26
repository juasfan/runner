import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { nanoid } from 'nanoid';
import * as moment from 'moment';
@Injectable({
  providedIn: 'root',
})
export class RecordService {
  payments: Payment[] = [];
  constructor(private localStorage: LocalStorageService) {}

  async getRecords() {
    const data: Payment[] = await this.localStorage.getItem('payments');
    this.payments = data ? data : [];
    return this.payments;
  }

  async getRecord(id: string) {
    const data = this.payments.find((payment) => payment.id === id);
    return data;
  }

  async addRecord(data: Payment) {
    data.id = nanoid();
    data.date = moment(new Date()).format('YYYYMMDD');

    this.payments.unshift(data);
    await this.localStorage.setItem('payments', this.payments);
  }

  async updateRecord(data: Payment) {
    for (let i in this.payments) {
      if (this.payments[i].id === data.id) {
        this.payments[i] = data;
        break;
      }
    }

    await this.localStorage.setItem('payments', this.payments);
  }
}

export interface Payment {
  id?: string;
  date?: string;
  title?: string;
  product?: number;
  delivery?: number;
  total?: number;
  note?: string;
}
