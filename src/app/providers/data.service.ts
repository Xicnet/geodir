import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { of } from 'rxjs'
import { Observable } from 'rxjs'
import { refCount, pluck, share, shareReplay, tap } from 'rxjs/operators';


//const apiUrl = "https://use.fair-coin.org/wp-json/custom/v1/all-posts";
const apiUrl = "http://localhost:83/wp-json/custom/v1/all-posts";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private items$: Observable;
  public responseCache = new Map();

  constructor(private http: HttpClient) {
  }

  public getGeoJSON(): Observable<any> {
    if (!this.items) {
      this.items = this.http.get<any>(apiUrl)
        .pipe(shareReplay(1),
          //.pipe(refCount());
          map(res => res.response)
        );

    }
    return this.items;
  }

  filterItems(searchTerm) {
    console.log("filterItems called");
    if(this.items$===undefined) {
      console.log("no items");
      return true;
    }
    return this.items$.response.filter((item) => {
      return (
        item.properties.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        || item.properties.description.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
      );
    });
  }
}