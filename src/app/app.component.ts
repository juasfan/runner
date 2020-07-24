import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LocalStorageService } from './shared/services/local-storage.service';

import * as moment from 'moment';
import { DailyRecord } from './pages/home/home.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private localStorage: LocalStorageService
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    let records: DailyRecord[] = [];
    let data: DailyRecord = {
      date: new Date(),
      product: 0,
      delivery: 0,
      total: 0,
      payments: [],
    };
    records = await this.localStorage.getItem('records');

    if (records) {
      let todayRecord = records.find((record) => {
        return (
          moment(records[0].date).format('l') === moment(data.date).format('l')
        );
      });

      if (!todayRecord) {
        records.unshift(data);
        await this.localStorage.setItem('records', records);
      }
    } else {
      records = [data];
      await this.localStorage.setItem('records', records);
    }

    console.log(records);
  }
}
