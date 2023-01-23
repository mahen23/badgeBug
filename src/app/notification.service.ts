import { Injectable } from '@angular/core';
import { ActionPerformed, LocalNotificationActionPerformed, LocalNotifications, LocalNotificationSchema, Weekday } from '@capacitor/local-notifications';


import { NavController } from '@ionic/angular';
import { Haptics, ImpactStyle } from '@capacitor/haptics';



@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  public notificationTriggered: boolean = false; //if notifications have been triggered at least once. 
  public notificationEventCreated: boolean = false; // notification created but not read
  public notificationXchangeCreated: boolean = false; // notification created but not read

  notifyAt = new Date();

  idExchange: any; 
  idEvent: any;

  constructor(
    public _navCtrl: NavController
  ) {
    try {
      LocalNotifications.requestPermissions(); // for iphone, android not required
    } catch (e) {
      console.log('there was an err', e);
    }
  }



  notifyEvents(count : any) {
    this.idEvent = Math.floor(Math.random() * 10);
    let text = "Vous avez " + count + " événement(s) modifié(s)";
    LocalNotifications.schedule({
      notifications: [{
        id: this.idEvent,
        title: "MHS: Alerte événements modifiés",
        body: text
      }]
    });
    Haptics.vibrate();
  }

  notifyExchanges(count : any) {
    this.idExchange = Math.floor(Math.random() * 10);
    let text = "Vous avez " + count + " nouvelle(s) conversation(s)"
    LocalNotifications.schedule({
      notifications: [{
        id: this.idExchange,
        title: "MHS: Alerte conversations",
        body: text
      }]
    });
    Haptics.vibrate();
  }






  registerLocalNotification() {
    LocalNotifications.addListener('localNotificationReceived', async (notification: LocalNotificationSchema) => {
      let createdNotification = notification;

      //checks if notifications have already been created, and stop from creating more
      if (createdNotification.id == this.idEvent) { // created event notification
        this.notificationEventCreated = true;
      }

      if (createdNotification.id == this.idExchange) { //created xChange notification
        this.notificationXchangeCreated = true;
      }
    });

    LocalNotifications.addListener('localNotificationActionPerformed', (notification: ActionPerformed) => {
      let executedNotification = notification;
      //{"actionId":"tap","notification":{"id":1,"title":"Alerte événements modifiés","body":"Vous avez 1 événements modifiés"}}

      //notification has been created and read.
      //checks if notifications have already been created, and stop from creating more
      if (executedNotification.notification.id == this.idEvent) { // created event notification
        this.notificationEventCreated = false;
        this._navCtrl.navigateForward("planning/modified");
      }

      if (executedNotification.notification.id == this.idExchange) { //created xChange notification
        this.notificationXchangeCreated = false;
        this._navCtrl.navigateForward("mailing/l");

      }

      this.notificationTriggered = true;

    });
  }

}
