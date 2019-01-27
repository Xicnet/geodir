import { Component, OnInit } from '@angular/core';

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
  constructor(public navCtrl: NavController, public dataService: DataService) {
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
    this.items$ = this.dataService.filterItems(search);
  }

  onSearchInput(){
    this.searching = true;
  }

}
