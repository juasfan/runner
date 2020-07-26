import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Payment, RecordService } from 'src/app/shared/services/record.service';
import * as moment from 'moment';
import { NavController } from '@ionic/angular';
import { FormService } from 'src/app/shared/services/form.service';

@Component({
  selector: 'app-edit-payment',
  templateUrl: './edit-payment.component.html',
  styleUrls: ['./edit-payment.component.scss'],
})
export class EditPaymentComponent implements OnInit {
  methods: string[] = ['Bank In', 'Cash on Delivery'];
  selectedMethod: string = this.methods[1];

  prices: number[] = [2, 3, 4, 5];
  selectedPrice: number = 3;

  form: FormGroup;
  record: Payment;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private formService: FormService,
    private recordService: RecordService
  ) {}

  async ngOnInit() {
    this.createForm();
    await this.patchForm();
    this.listenChanges();
  }

  createForm() {
    this.form = this.formBuilder.group({
      title: [null, Validators.required],
      delivery: [this.selectedPrice, Validators.required],
    });

    this.price();
  }

  async patchForm() {
    let id = this.route.snapshot.paramMap.get('id');
    this.record = await this.recordService.getRecord(id);

    if (this.record.note) {
      this.note();
      this.selectMethod('Bank In');
    }
    this.selectedPrice = this.record.delivery;
    this.form.patchValue({
      ...this.record,
    });
  }

  listenChanges() {
    this.form.get('delivery').valueChanges.subscribe((value) => {
      this.selectedPrice = value;
    });
  }

  price() {
    this.form.removeControl('note');
    this.form.addControl('product', new FormControl(null, Validators.required));
  }

  note() {
    this.form.removeControl('product');
    this.form.addControl('note', new FormControl('Bank In'));
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

  dateToday(): string {
    let date = new Date();
    return moment(date).format('dddd<br>MMMM Do YYYY');
  }

  submit() {
    this.formService.markAllDirty(this.form);
    let { id, date } = this.record;
    if (this.form.valid) {
      let data: Payment = {
        id,
        date,
        ...this.form.value,
      };
      data.total = data.delivery + (data.product ? data.product : 0);

      this.recordService.updateRecord(data);
      this.back();
    }
  }

  back() {
    this.navCtrl.navigateBack('home');
  }
}
