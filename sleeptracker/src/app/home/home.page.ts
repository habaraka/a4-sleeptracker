import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonDatetime, IonButton, IonRange} from '@ionic/angular/standalone';
import { SleepService } from '../services/sleep.service';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonDatetime, IonButton, IonRange],
  
})
export class HomePage {

	selectedSleepTime: string = '';
	selectedWakeupTime: string = '';
	SelectedSleepenes: number = 0; 

  constructor(public sleepService:SleepService) {

	}

	async ngOnInit() {
		await this.sleepService.ready;
		console.log('Restored sleep records:', this.allSleepData);
	}

	/* Ionic doesn't allow bindings to static variables, so this getter can be used instead. */
	get allSleepData() {
		return SleepService.AllSleepData;
	}

	onSleepTimeChange (event: CustomEvent){
		if (typeof event.detail.value === 'string'){
			this.selectedSleepTime = event.detail.value;
		}

	}
	onWakeTimeChange(event: CustomEvent){
		if (typeof event.detail.value === 'string'){
			this.selectedWakeupTime = event.detail.value;
		}
	}

	async saveOvernightSleep() {
    	await this.sleepService.ready;
		if (!this.selectedSleepTime || !this.selectedWakeupTime) {
			return;
		}



		const sleepStart = new Date(this.selectedSleepTime);

		const sleepEnd = new Date(this.selectedWakeupTime);
		if (sleepEnd <= sleepStart) {
				sleepEnd.setDate(sleepEnd.getDate() + 1);
			}

		console.log('Sleep start:', sleepStart);
		console.log('Sleep end:', sleepEnd);
		const sleepdata = new OvernightSleepData(sleepStart, sleepEnd);
		this.sleepService.logOvernightData(sleepdata);

		

		console.log(this.allSleepData);
		console.log(sleepdata.summaryString());

	}

	onSleepinessChange(event: CustomEvent){
		if(typeof event.detail.value === 'number'){
			this.SelectedSleepenes = event.detail.value;
		}
	}

	async saveSleepinessChange(){
		await this.sleepService.ready;
		if(this.SelectedSleepenes == 0){
			return;
		}
		const sleepenessData = new StanfordSleepinessData(this.SelectedSleepenes);
		this.sleepService.logSleepinessData(sleepenessData);
		console.log(sleepenessData);

	}
	
}
