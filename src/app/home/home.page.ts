import { Component } from '@angular/core';

import { Badge } from '@capawesome/capacitor-badge';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  badgeNumber: any;

  constructor(private notifService: NotificationService) { }

  async setBadge(count: number) {
    console.log("Setting badge count to: ", count);
    await Badge.set({ count: count });
    const result = await Badge.get();
    console.log("Get Badge Count: ", JSON.stringify(result));
  }


  getRandomArbitrary(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  ngOnInit(): void {
    this.badgeNumber = this.getRandomArbitrary(10, 99);
    this.setBadge(this.badgeNumber)
    //badge number on icon will not be updated here. 
    
    this.notifService.registerLocalNotification(); //listener for notifications click
    this.setBadge(this.badgeNumber)


    setInterval(() => {
      this.badgeNumber = this.getRandomArbitrary(10, 99);
      this.setBadge(this.badgeNumber)
      this.notifService.notifyExchanges(this.badgeNumber);
      //badge count on icon will be updated only after above line has been executed. 
    }, (60 * 1000));

  }



}
