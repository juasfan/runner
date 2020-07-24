import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { NavController } from '@ionic/angular';
import * as moment from 'moment';
import { FormService } from 'src/app/shared/services/form.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { DailyRecord, HomeService, Payment } from '../home.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  methods: string[] = ['Bank In', 'Cash on Delivery'];
  selectedMethod: string = this.methods[1];

  prices: number[] = [2, 3, 4, 5];
  selectedPrice: number = 3;

  form: FormGroup;

  records: DailyRecord[] = [];
  todayRecord: DailyRecord;

  constructor(
    private formBuilder: FormBuilder,
    private formService: FormService,
    private localStorage: LocalStorageService,
    private navController: NavController,
    private homeService: HomeService
  ) {
    this.createForm();
  }

  dateToday(): string {
    let date = this.homeService.selectedRecord.date;

    return moment(date).format('dddd<br>MMMM Do YYYY');
  }

  async ngOnInit() {
    this.listenChanges();
    this.records = await this.localStorage.getItem('records');
    this.todayRecord = this.records[0];
  }

  createForm() {
    this.form = this.formBuilder.group({
      title: [null, Validators.required],
    });
  }

  patchForm() {}

  listenChanges() {
    this.form.get('delivery').valueChanges.subscribe((value) => {
      if (value === null) {
        this.selectedPrice = null;
      } else if (value === 2 || value === 3 || value === 4 || value || 5) {
        this.selectedPrice = value;
      }
    });
  }

  price() {
    this.form.removeControl('note');

    this.form.addControl('product', new FormControl(null, Validators.required));
    this.form.addControl(
      'delivery',
      new FormControl(this.selectedPrice, Validators.required)
    );
  }

  note() {
    this.form.removeControl('product');
    this.form.removeControl('delivery');

    this.form.addControl(
      'note',
      new FormControl('Bank In', Validators.required)
    );
  }

  selectMethod(method: string) {
    this.selectedMethod = method;

    switch (method) {
      case this.methods[0]:
        this.note();
        break;
      default:
        this.price();
    }
  }

  selectPrice(price: number) {
    this.selectedPrice = price;

    this.form.patchValue({
      delivery: this.selectedPrice,
    });
  }

  async submit() {
    this.formService.markAllDirty(this.form);

    if (this.form.valid) {
      let data: Payment = this.form.value;
      if (!data.note) {
        data = { ...data, total: data.delivery + data.product };
      }

      await this.updateRecord(data);
      await this.navController.navigateBack('home');
    }
  }

  async updateRecord(payment?: Payment) {
    if (!payment.note) {
      this.todayRecord.product += payment.product;
      this.todayRecord.delivery += payment.delivery;
      this.todayRecord.total += payment.total;
    }

    this.todayRecord.payments.push(payment);

    await this.localStorage.setItem('records', this.records);
  }

  cancel() {
    this.navController.navigateBack('home');
  }
}
