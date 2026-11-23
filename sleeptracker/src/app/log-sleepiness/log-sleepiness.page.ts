import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonRange, IonButton } from '@ionic/angular/standalone';
import { SleepService } from '../services/sleep.service';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';

@Component({
  selector: 'app-log-sleepiness',
  templateUrl: './log-sleepiness.page.html',
  styleUrls: ['./log-sleepiness.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonRange, IonButton]
})
export class LogSleepinessPage implements OnInit {
  selectedSleepiness: number = 0;
  formatPin = (value: number) => `${value}`;

  constructor(private sleepService: SleepService) { }

  ngOnInit() {
  }

  onSleepinessChange(event: CustomEvent) {
    if (typeof event.detail.value === 'number') {
      this.selectedSleepiness = event.detail.value;
    }
  }
	async saveSleepinessChange(){
		await this.sleepService.ready;
		if(this.selectedSleepiness == 0){
			return;
		}
		const sleepenessData = new StanfordSleepinessData(this.selectedSleepiness);
		this.sleepService.logSleepinessData(sleepenessData);
		console.log(sleepenessData);

	}
  showScaleInfo: boolean = false;

  toggleScaleInfo() {
    this.showScaleInfo = !this.showScaleInfo;
  }

}
