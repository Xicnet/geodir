import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NavController } from '@ionic/angular';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import { DataService } from '../providers/data.service';
import { ModalService } from '../providers/modal/modal.service';
import { LinksService } from '../providers/links/links.service';

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
    private geolocation: Geolocation,
    public modal: ModalService,
    public links: LinksService,
  ) {
    this.searchControl = new FormControl();
  }

  ngOnInit() {
    // Get listing
    this.items$ = this.dataService.items$;
    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe(search => {
      this.searching = false;
      this.items$ = this.dataService.filterItems(search);
    });
  }

  onSearchInput() {
    this.searching = true;
  }

  openModal(data) {
    this.modal.openModal(data);
  }

  openNavigator(e, address) {
    this.links.openNavigator(address);
  }

  openLink(e, url) {
    this.links.openLink(url);
  }

  geoZoom(location) {
    this.navCtrl.navigate(`/tabs/map?location=${location}`, {});
    //this.navCtrl.navigate(["/tabs/map"], {queryParams: {coords: coords}});
  }
}
