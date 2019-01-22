import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController, ModalController, PopoverController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {
  token: Observable<any>;
  loading = true;
  private querySubscription: Subscription;

  constructor(public navCtrl: NavController
  ) {

  }

  ngOnInit() {
  }

} /* end class TabsPage */
