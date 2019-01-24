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
  items: any;
  constructor(public navCtrl: NavController, public dataService: DataService) {
    this.searchControl = new FormControl();
  }

  ngOnInit() {
    this.setFilteredItems('');
    this.searchControl.valueChanges.pipe(debounceTime(700)).subscribe(search => {
      this.setFilteredItems(search);
    });

  }

  setFilteredItems(search) {
    this.items = this.dataService.filterItems(search);
  }
}
