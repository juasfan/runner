import { Injectable } from '@angular/core';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  selectedPayment: Payment;
  selectedRecord: DailyRecord;

  records: DailyRecord[] = [];

  constructor(private localStorage: LocalStorageService) {}

  async getRecords(): Promise<DailyRecord[]> {
    this.records = await this.localStorage.getItem('records');
    return this.records;
  }

  async addPayment(payment: Payment): Promise<void> {}

  async updatePayment(payment: Payment): Promise<void> {}

  async deletePayment(payment: Payment): Promise<void> {}

  async clearRecord(): Promise<void> {
    this.records = [];
    let data: DailyRecord = {
      date: new Date(),
      product: 0,
      delivery: 0,
      total: 0,
      payments: [],
    };

    this.records.push(data);
    await this.localStorage.setItem('records', this.records);
  }
}

export interface DailyRecord {
  date: Date;
  product: number;
  delivery: number;
  total: number;
  payments: Payment[];
}

export interface Payment {
  title: string;
  product: number;
  delivery: number;
  total: number;
  note?: string;
}
