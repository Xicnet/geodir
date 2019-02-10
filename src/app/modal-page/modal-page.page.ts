import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-modal-page',
  templateUrl: './modal-page.page.html',
  styleUrls: ['./modal-page.page.scss'],
})
export class ModalPagePage implements OnInit {
  item = null;

  constructor(private navParams: NavParams, private popoverController: ModalController,
    public platform: Platform
  ) { }

  ngOnInit() {
    this.item = this.navParams.get('item');
  }

  closeModal() {
    this.popoverController.dismiss();
  }

  openNavigator(e, address) {
    let target = this.platform.is('cordova') ? '_system' : '_blank';
    window.open(`http://maps.google.com/maps?&daddr=${address}`, target);

  }

}
