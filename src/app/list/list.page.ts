import { Component, OnInit } from '@angular/core';
import { Platform, ModalController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NavController } from '@ionic/angular';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import { ModalPagePage } from './../modal-page/modal-page.page';
import { DataService } from '../providers/data.service';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  searchTerm: string = '';
  searchControl: FormControl;
  items$: any;
  searching: any = false;

  constructor(public navCtrl: NavController, public dataService: DataService,
    public platform: Platform,
    private geolocation: Geolocation,
    public modalCtrl: ModalController,
  ) {
    this.searchControl = new FormControl();
  }

  ngOnInit() {
    // Get listing
    this.items$ = this.dataService.getGeoJSON();
    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe(search => {
      this.searching = false;
      this.setFilteredItems(search);
    });

    this.geolocation.getCurrentPosition().then((resp) => {
      this.searching = true;
      this.dataService.sortNearBy(resp.coords.latitude, resp.coords.longitude).subscribe(res => this.searching = false);
    }).catch((error) => {
      console.log('Error getting location', error);
    });

  }

  setFilteredItems(search) {
    console.log("setFilteredItems search: ", search);
    this.items$ = this.dataService.filterItems(search);
    console.log(this.items$.subscribe());
  }

  onSearchInput() {
    this.searching = true;
  }

  openNavigator(e, address) {
    let target = this.platform.is('cordova') ? '_system' : '_blank';
    window.open(`http://maps.google.com/maps?&daddr=${address}`, target);
  }

  openLink(e, url) {
    let target = this.platform.is('cordova') ? '_system' : '_blank';
    window.open(url, '_blank');
  }

  async openModal(data) {
    const modalPage = await this.modalCtrl.create({
      component: ModalPagePage,
      componentProps: {
        item: data
      },
    });
    await modalPage.present();
  }

  geoZoom(location) {
    this.navCtrl.navigate(`/tabs/map?location=${location}`, {});
    //this.navCtrl.navigate(["/tabs/map"], {queryParams: {coords: coords}});
  }
}
