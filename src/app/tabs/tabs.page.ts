import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController, ModalController, PopoverController } from '@ionic/angular';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';

import gql from 'graphql-tag';
import mutation from 'graphql-tag';

import { PopoverPage } from '../popover/popover.page';



@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {
  token: Observable<any>;
  listings: any[];
  loading = true;
  error: any;
  private querySubscription: Subscription;

  constructor(private apollo: Apollo, public navCtrl: NavController, private modalCtrl: ModalController,
    private popoverController: PopoverController,
  ) {

  }

  async openPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverPage,
      event: ev,
      componentProps: {
        custom_id: 1
      }
    });
    await popover.present();
  }

  ngOnInit() {
  }




}
