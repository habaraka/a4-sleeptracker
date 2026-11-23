
import { Component } from '@angular/core';
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
  selector: 'app-log-sleep',
  templateUrl: './log-sleep.page.html',
  styleUrls: ['./log-sleep.page.scss'],
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
export class LogSleepPage {

  sleeptime = '';
  WakeUptime = '';

  saved = false;
  alreadyLogged = false;
  errorMessage = '';
  isSaving = false;

  constructor(private sleepService: SleepService) {}

  // Check every time the user opens this tab.
  async ionViewWillEnter() {
    try {
      await this.sleepService.ready;

      this.alreadyLogged =
        this.sleepService.hasOvernightSleepForDate(
          new Date()
        );

    } catch (error) {
      this.errorMessage =
        'Unable to check your saved sleep records.';
      console.error(error);
    }
  }

  onSleepTimeChange(event: CustomEvent) {
    if (typeof event.detail.value === 'string') {
      this.sleeptime = event.detail.value;
      this.saved = false;
    }
  }

  onWakeTimeChange(event: CustomEvent) {
    if (typeof event.detail.value === 'string') {
      this.WakeUptime = event.detail.value;
      this.saved = false;
    }
  }

  // Use the selected clock time with today's date.
  private getTimeForToday(value: string): Date {
    const selected = new Date(value);

    if (Number.isNaN(selected.getTime())) {
      throw new Error('Please select a valid time.');
    }

    const result = new Date();

    result.setHours(
      selected.getHours(),
      selected.getMinutes(),
      0,
      0
    );

    return result;
  }

  async saveSleep() {
    if (this.isSaving || this.alreadyLogged) return;

    this.errorMessage = '';
    this.saved = false;

    if (!this.sleeptime || !this.WakeUptime) {
      this.errorMessage =
        'Please select both your bedtime and wake-up time.';
      return;
    }

    this.isSaving = true;

    try {
      await this.sleepService.ready;

      // Wake-up belongs to TODAY.
      const wakeup =
        this.getTimeForToday(this.WakeUptime);

      // Bedtime starts on today's date.
      const bedtime =
        this.getTimeForToday(this.sleeptime);

      // If bedtime is later than wake-up,
      // bedtime belongs to YESTERDAY.
      if (bedtime >= wakeup) {
        bedtime.setDate(
          bedtime.getDate() - 1
        );
      }

      const record = new OvernightSleepData(
        bedtime,
        wakeup
      );

      await this.sleepService.logOvernightData(
        record
      );

      this.saved = true;
      this.alreadyLogged = true;

      console.log(
        'Sleep saved:',
        record.summaryString()
      );

    } catch (error) {
      this.errorMessage =
        error instanceof Error
          ? error.message
          : 'Unable to save sleep.';

      console.error(error);

    } finally {
      this.isSaving = false;
    }
  }
}
