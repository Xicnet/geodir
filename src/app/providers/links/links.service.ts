import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LinksService {

  constructor(
    public platform: Platform,
  ) { }

  openLink(url) {
    let target = this.platform.is('cordova') ? '_system' : '_blank';
    window.open(url, '_blank');
  }

  openTwitter(url) {
    this.openLink('https://twitter.com/'+url);
  }

  mailto(email) {
    this.platform.ready().then(() => {
        window.open(email);
    });
  }

  openNavigator(address) {
    let target = this.platform.is('cordova') ? '_system' : '_blank';
    window.open(`http://maps.google.com/maps?&daddr=${address}`, target);
  }
}
