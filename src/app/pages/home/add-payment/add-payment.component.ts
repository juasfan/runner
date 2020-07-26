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
import { Payment, RecordService } from 'src/app/shared/services/record.service';

@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.scss'],
})
export class AddPaymentComponent implements OnInit {
  methods: string[] = ['Bank In', 'Cash on Delivery'];
  selectedMethod: string = this.methods[1];

  prices: number[] = [2, 3, 4, 5];
  selectedPrice: number = 3;

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private formService: FormService,
    private navController: NavController,
    private recordService: RecordService
  ) {
    this.createForm();
  }

  dateToday(): string {
    let date = new Date();
    return moment(date).format('dddd<br/>MMMM Do YYYY');
  }

  async ngOnInit() {
    this.listenChanges();
  }

  createForm() {
    this.form = this.formBuilder.group({
      title: [null, Validators.required],
      delivery: [this.selectedPrice, Validators.required],
    });

    this.price();
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

  async submit() {
    this.formService.markAllDirty(this.form);

    if (this.form.valid) {
      let data: Payment = this.form.value;
      data.total = data.delivery + (data.product ? data.product : 0);

      this.recordService.addRecord(data);
      this.back();
    }
  }

  back() {
    this.navController.navigateBack('home');
  }
}
