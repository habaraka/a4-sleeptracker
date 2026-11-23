
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonDatetime,
  IonButton,
  IonModal,
  IonButtons
} from '@ionic/angular/standalone';

import { SleepService } from '../services/sleep.service';
import { AlertController } from '@ionic/angular/standalone';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';

@Component({
  selector: 'app-sleep-history',
  templateUrl: './sleep-history.page.html',
  styleUrls: ['./sleep-history.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonDatetime,
    CommonModule,
    FormsModule,
    IonButton,
    IonModal,
    IonButtons
  ]
})
export class SleepHistoryPage implements OnInit {

  selectedDate: string = this.getLocalDate(new Date());

  isEditSleepModalOpen: boolean = false;

  editingSleepId: string = '';

  editBedtime: string = '';

  editWakeUp: string = '';

  constructor(public sleepService: SleepService, private alertController: AlertController) {}

  async ngOnInit() {
    await this.sleepService.ready;
  }

  getLocalDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  onDateChange(event: CustomEvent) {
    const value = event.detail.value;

    if (typeof value === 'string') {
      this.selectedDate = value.substring(0, 10);
    }
  }

  get selectedOvernightRecords() {
    return SleepService.AllOvernightData.filter(record => {
      const wakeDate = new Date(record.sleepEnd);

      return this.getLocalDate(wakeDate) === this.selectedDate;
    });
  }

  get selectedSleepinessRecords() {
    return SleepService.AllSleepinessData
      .filter(record => {
        const loggedDate = new Date(record.loggedAt);

        return this.getLocalDate(loggedDate) === this.selectedDate;
      })
      .sort((a, b) =>
        new Date(a.loggedAt).getTime() -
        new Date(b.loggedAt).getTime()
      );
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  get formattedSelectedDate(): string {
    const [year, month, day] = this.selectedDate
      .split('-')
      .map(Number);

    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }

  get datesWithRecords(): string[] {
    const dates = new Set<string>();

    for (const record of SleepService.AllOvernightData) {
      const wakeDate = new Date(record.sleepEnd);
      dates.add(this.getLocalDate(wakeDate));
    }

    for (const record of SleepService.AllSleepinessData) {
      const loggedDate = new Date(record.loggedAt);
      dates.add(this.getLocalDate(loggedDate));
    }

    return Array.from(dates);
  }
  get highlightedDates() {
    return this.datesWithRecords.map(date => ({
      date: date,
      textColor: '#ffffff',
      backgroundColor: '#3880ff'
    }));
  }
  async deleteRecord(id: string) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this record?'
    );

    if (!confirmed) {
      return;
    }

    try {
      await this.sleepService.deleteSleepRecord(id);
      console.log('Record deleted successfully');
    } catch (error) {
      console.error('Failed to delete record:', error);
    }
  }

  async editSleepinessRecord(id: string, currentValue: number) {
    const alert = await this.alertController.create({
      header: 'Edit Sleepiness',
      message: 'Select your corrected sleepiness level.',
      inputs: [1, 2, 3, 4, 5, 6, 7].map(value => ({
        type: 'radio' as const,
        label: `${value} / 7 — ${StanfordSleepinessData.ScaleValues[value]}`,
        value: value,
        checked: value === currentValue
      })),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Save',
          handler: (newValue: number | undefined) => {
            if (typeof newValue !== 'number') {
              return false;
            }

            void this.sleepService
              .updateSleepinessRecord(id, newValue)
              .catch(error => {
                console.error('Failed to update sleepiness:', error);
              });
            return true;
          }
        }
      ]
    });

    await alert.present();
  }
  editOvernightRecord(id: string) {

    const record = SleepService.AllOvernightData.find(
      record => record.id === id
    );

    if (!record) {
      return;
    }

    this.editingSleepId = id;

    this.editBedtime = new Date(record.sleepStart).toISOString();

    this.editWakeUp = new Date(record.sleepEnd).toISOString();

    this.isEditSleepModalOpen = true;
  }

  format24HourTime(date: Date): string {
    const d = new Date(date);

    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
  }

  onEditBedtimeChange(event: CustomEvent) {
    const value = event.detail.value;

    if (typeof value === 'string') {
      this.editBedtime = value;
    }
  }

  onEditWakeUpChange(event: CustomEvent) {
    const value = event.detail.value;

    if (typeof value === 'string') {
      this.editWakeUp = value;
    }
  }
  async saveEditedSleep() {
    if (!this.editBedtime || !this.editWakeUp) {
      return;
    }

    const original = SleepService.AllOvernightData.find(
      record => record.id === this.editingSleepId
    );

    if (!original) {
      return;
    }

    const bedtime = new Date(original.sleepStart);
    const wakeUp = new Date(original.sleepStart);

    const selectedBedtime = new Date(this.editBedtime);
    const selectedWakeUp = new Date(this.editWakeUp);

    if (
      Number.isNaN(selectedBedtime.getTime()) ||
      Number.isNaN(selectedWakeUp.getTime())
    ) {
      console.error('Invalid selected time');
      return;
    }

    bedtime.setHours(
      selectedBedtime.getHours(),
      selectedBedtime.getMinutes(),
      0,
      0
    );

    wakeUp.setHours(
      selectedWakeUp.getHours(),
      selectedWakeUp.getMinutes(),
      0,
      0
    );


    if (wakeUp <= bedtime) {
      wakeUp.setDate(wakeUp.getDate() + 1);
    }

    try {
      await this.sleepService.updateOvernightRecord(
        this.editingSleepId,
        bedtime,
        wakeUp
      );

      this.isEditSleepModalOpen = false;

      console.log('Overnight sleep updated successfully');
    } catch (error) {
      console.error('Failed to update overnight sleep:', error);
    }
  }
}
