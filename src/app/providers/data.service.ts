import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

const apiUrl = "https://use.fair-coin.org/wp-json/custom/v1/all-posts";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  items: any;

  constructor(public http: HttpClient) {
    var _tems = [
      {title: 'one'},
      {title: 'two'},
      {title: 'three'},
      {title: 'four'},
      {title: 'five'},
      {title: 'six'}
    ]
    this.getGeoJSON();
  }

  getGeoJSON() {
    this.http.get(apiUrl)
      .subscribe(data => {
        this.items = data;
        //console.log(data);
      });
  }

  filterItems(searchTerm) {
    if(this.items===undefined) {
      console.log("no items");
      return;
    }
    console.log("items: ", this.items===undefined, typeof this.items, this.items.response);
    return this.items.response.filter((item) => {
      console.log(item);
      return item.properties.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }
}
