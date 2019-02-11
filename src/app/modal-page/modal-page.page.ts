import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, NavController } from '@ionic/angular';
import { LinksService } from '../providers/links/links.service';

@Component({
  selector: 'app-modal-page',
  templateUrl: './modal-page.page.html',
  styleUrls: ['./modal-page.page.scss'],
})
export class ModalPagePage implements OnInit {
  item = null;

  constructor(private navParams: NavParams,
    private popoverController: ModalController,
    public links: LinksService,
    public navCtrl: NavController,
  ) { }

  ngOnInit() {
    this.item = this.navParams.get('item');
  }

  closeModal() {
    this.popoverController.dismiss();
  }

  openNavigator(e, address) {
    this.links.openNavigator(address);
  }

  openLink(e, url) {
    this.links.openLink(url);
  }

  geoZoom(location) {
    this.navCtrl.navigate(`/tabs/map?location=${location}`, {});
    this.closeModal();
  }
}
