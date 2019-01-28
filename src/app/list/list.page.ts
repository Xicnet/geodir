import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

import { NavController } from '@ionic/angular';
import { DataService } from '../providers/data.service';
import { debounceTime } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

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
  constructor(public navCtrl: NavController, public dataService: DataService, public platform: Platform) {
    this.searchControl = new FormControl();
  }

  ngOnInit() {
    this.items$ = this.dataService.getGeoJSON();
    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe(search => {
      this.searching = false;
      this.setFilteredItems(search);
    });

  }

  setFilteredItems(search) {
    console.log("setFilteredItems search: ", search);
    this.items$ = this.dataService.filterItems(search);
    console.log(this.items$.subscribe());
  }

  onSearchInput(){
    this.searching = true;
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
