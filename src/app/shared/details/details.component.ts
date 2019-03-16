import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { LinksService } from 'src/app/providers/links/links.service';

@Component({
  selector: 'listing-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  @Input() item: any;
  
  constructor(
    private popoverController: ModalController,
    public links: LinksService,
    public navCtrl: NavController) { }

  ngOnInit() {
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

  openTwitter(e, url) {
    this.links.openTwitter(url);
  }

  mailto(email) {
    this.links.mailto('mailto:'+email);
  }
  geoZoom(location) {
    this.navCtrl.navigate(`/tabs/map?location=${location}`, {});
    this.closeModal();
  }
}
