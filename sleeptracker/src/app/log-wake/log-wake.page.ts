
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonDatetime,
  IonButton
} from '@ionic/angular/standalone';

import { SleepService } from '../services/sleep.service';
import { OvernightSleepData } from '../data/overnight-sleep-data';

@Component({
  selector: 'app-log-wake',
  templateUrl: './log-wake.page.html',
  styleUrls: ['./log-wake.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonDatetime,
    IonButton
  ]
})
export class LogWakePage implements OnInit {

  WakeUptime: string = '';
  wakeupSaved: boolean = false;
  errorMessage: string = '';
  alreadyLogged: boolean = false;

  constructor(private sleepService: SleepService) {}

  ngOnInit() {}

  ionViewWillEnter() {
    void this.checkExistingSleep();
  }

  async checkExistingSleep() {
    await this.sleepService.ready;

    const today = new Date();

    this.alreadyLogged =
      this.sleepService.hasOvernightSleepForDate(today);

    if (this.alreadyLogged) {
      this.errorMessage =
        'Your overnight sleep has already been logged! Edit it from the History tab.';
    } else {
      this.errorMessage = '';
    }
  }

  onWakeTimeChange(event: CustomEvent) {
    console.log('Wake-up picker value:', event.detail.value);
    if (typeof event.detail.value === 'string') {
      this.WakeUptime = event.detail.value;
    }
  }

  async saveWakeUptime() {
    console.log('Save button clicked. WakeUptime:', this.WakeUptime);
    this.errorMessage = '';
    this.wakeupSaved = false;

    if (this.alreadyLogged) {
      this.errorMessage =
        'Your overnight sleep has already been logged! Edit it from the History tab.';
      return;
    }

    if (!this.WakeUptime) {
      this.errorMessage = 'Please select a wake-up time.';
      return;
    }

    const wakeUptime = new Date(this.WakeUptime);

    if (Number.isNaN(wakeUptime.getTime())) {
      this.errorMessage = 'Please select a valid wake-up time.';
      return;
    }

    try {
      const bedtime = await this.sleepService.getPendingBedtime();

      if (bedtime === null) {
        this.errorMessage = 'Please save your bedtime first.';
        return;
      }

      if (wakeUptime <= bedtime) {
        wakeUptime.setDate(wakeUptime.getDate() + 1);
      }

      const sleepRecord = new OvernightSleepData(
        bedtime,
        wakeUptime
      );

      await this.sleepService.logOvernightData(sleepRecord);

      await this.sleepService.clearPendingBedtime();

      this.wakeupSaved = true;
      this.alreadyLogged = true;

      this.errorMessage =
        'Your overnight sleep has already been logged! Edit it from the History tab.';

      console.log(
        'Sleep duration:',
        sleepRecord.summaryString()
      );

    } catch (error) {
      if (error instanceof Error) {
        this.errorMessage = error.message;
      } else {
        this.errorMessage = 'Unable to save overnight sleep.';
      }

      console.error('Failed to save overnight sleep:', error);

      await this.checkExistingSleep();
    }
  }
}
