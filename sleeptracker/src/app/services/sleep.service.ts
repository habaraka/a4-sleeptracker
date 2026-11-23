
import { Injectable } from '@angular/core';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class SleepService {

  public static AllSleepData: SleepData[] = [];
  public static AllOvernightData: OvernightSleepData[] = [];
  public static AllSleepinessData: StanfordSleepinessData[] = [];

  public readonly ready: Promise<void>;

  private saveQueue: Promise<void> = Promise.resolve();

  constructor() {
    this.ready = this.loadData();
  }


  private isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  public hasOvernightSleepForDate(date: Date): boolean {
    return SleepService.AllOvernightData.some(record =>
      this.isSameDate(record.sleepEnd, date)
    );
  }



  private validateOvernightSleep(
    bedtime: Date,
    wakeup: Date
  ): void {

    if (
      Number.isNaN(bedtime.getTime()) ||
      Number.isNaN(wakeup.getTime())
    ) {
      throw new Error('Invalid bedtime or wake-up time.');
    }

    const durationHours =
      (wakeup.getTime() - bedtime.getTime()) /
      (1000 * 60 * 60);

    // Prevent negative, zero, or unusually long sessions.
    // 16 hours is an app validation limit.
    if (durationHours <= 0 || durationHours > 16) {
      throw new Error(
        'Sleep duration must be greater than 0 and no more than 16 hours. Please check your times.'
      );
    }
  }




	public async logOvernightData(
	sleepData: OvernightSleepData
	): Promise<void> {

	await this.ready;

	// Check that the sleep duration is valid.
	this.validateOvernightSleep(
		sleepData.sleepStart,
		sleepData.sleepEnd
	);

	// Allow only one overnight sleep record per wake-up date.
	if (this.hasOvernightSleepForDate(sleepData.sleepEnd)) {
		throw new Error(
		'You already logged your sleep for today. Edit it from History.'
		);
	}

	// Save one complete record containing bedtime and wake-up.
	SleepService.AllSleepData.push(sleepData);
	SleepService.AllOvernightData.push(sleepData);

	await this.saveData();
	}

 

  public logSleepinessData(
    sleepData: StanfordSleepinessData
  ): void {

    SleepService.AllSleepData.push(sleepData);
    SleepService.AllSleepinessData.push(sleepData);

    void this.saveData();
  }



  private async saveData(): Promise<void> {

    this.saveQueue = this.saveQueue.then(async () => {

      await this.ready;

      const data = JSON.stringify(
        SleepService.AllSleepData
      );

      await Preferences.set({
        key: 'sleepData',
        value: data
      });
    });

    return this.saveQueue;
  }


  private async loadData(): Promise<void> {

    const result = await Preferences.get({
      key: 'sleepData'
    });

    if (result.value === null) {
      return;
    }

    const savedData = JSON.parse(result.value);

    for (const item of savedData) {

      if ('sleepStart' in item && 'sleepEnd' in item) {

        const record = new OvernightSleepData(
          new Date(item.sleepStart),
          new Date(item.sleepEnd)
        );

        record.id = item.id;
        record.loggedAt = new Date(item.loggedAt);

        SleepService.AllSleepData.push(record);
        SleepService.AllOvernightData.push(record);

      } else if ('loggedValue' in item) {

        const record = new StanfordSleepinessData(
          item.loggedValue,
          new Date(item.loggedAt)
        );

        record.id = item.id;

        SleepService.AllSleepData.push(record);
        SleepService.AllSleepinessData.push(record);
      }
    }
  }



  public async saveBedtime(bedtime: Date): Promise<void> {

    await this.ready;

    if (Number.isNaN(bedtime.getTime())) {
      throw new Error('Invalid bedtime.');
    }

    const pending = await this.getPendingBedtime();

    if (pending !== null) {
      throw new Error(
        'You already have a bedtime saved. Log your wake-up time or cancel it first.'
      );
    }

    await Preferences.set({
      key: 'pendingBedtime',
      value: bedtime.toISOString()
    });
  }



  public async getPendingBedtime(): Promise<Date | null> {

    const result = await Preferences.get({
      key: 'pendingBedtime'
    });

    if (!result.value) {
      return null;
    }

    const bedtime = new Date(result.value);

    if (Number.isNaN(bedtime.getTime())) {
      throw new Error('Saved bedtime is invalid.');
    }

    return bedtime;
  }

 
  public async clearPendingBedtime(): Promise<void> {

    await Preferences.remove({
      key: 'pendingBedtime'
    });
  }

 
  public async deleteSleepRecord(id: string): Promise<void> {

    await this.ready;

    SleepService.AllSleepData =
      SleepService.AllSleepData.filter(
        record => record.id !== id
      );

    SleepService.AllOvernightData =
      SleepService.AllOvernightData.filter(
        record => record.id !== id
      );

    SleepService.AllSleepinessData =
      SleepService.AllSleepinessData.filter(
        record => record.id !== id
      );

    await this.saveData();
  }


  public async updateSleepinessRecord(
    id: string,
    newValue: number
  ): Promise<void> {

    await this.ready;

    if (
      !Number.isInteger(newValue) ||
      newValue < 1 ||
      newValue > 7
    ) {
      throw new Error(
        'Sleepiness level must be between 1 and 7.'
      );
    }

    const record = SleepService.AllSleepinessData.find(
      record => record.id === id
    );

    if (!record) {
      throw new Error('Sleepiness record not found.');
    }

    record.loggedValue = newValue;

    await this.saveData();
  }



  public async updateOvernightRecord(
    id: string,
    newBedtime: Date,
    newWakeup: Date
  ): Promise<void> {

    await this.ready;

    const record = SleepService.AllOvernightData.find(
      record => record.id === id
    );

    if (!record) {
      throw new Error('Overnight sleep record not found.');
    }

    this.validateOvernightSleep(
      newBedtime,
      newWakeup
    );

    // Exclude the record being edited when
    // checking for duplicate wake-up dates.
    const duplicate = SleepService.AllOvernightData.some(
      other =>
        other.id !== id &&
        this.isSameDate(other.sleepEnd, newWakeup)
    );

    if (duplicate) {
      throw new Error(
        'A sleep record already exists for this wake-up date.'
      );
    }

    record.sleepStart = newBedtime;
    record.sleepEnd = newWakeup;

    await this.saveData();
  }
}
