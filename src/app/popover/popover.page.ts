import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.page.html',
  styleUrls: ['./popover.page.scss'],
})
export class PopoverPage implements OnInit {
  item = null;

  constructor(private navParams: NavParams, private popoverController: PopoverController,
    public platform: Platform
  ) { }

  ngOnInit() {
    this.item = this.navParams.get('item');
  }

  closePopover() {
    this.popoverController.dismiss();
  }

  openNavigator(e, coordinates) {
    let coords = coordinates;
    //let coords = coordinates[1]+','+coordinates[0]
    if(this.platform.is('cordova')) {
      window.open('geo:?q='+coords, '_blank');
    } else {
      window.open('https://www.google.com/maps/search/?api=1&query='+coords, '_blank');
    }
  }

}
