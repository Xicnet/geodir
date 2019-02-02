import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { of } from 'rxjs'
import { Observable } from 'rxjs'
import { refCount, pluck, share, shareReplay, tap } from 'rxjs/operators';
import { filter } from 'rxjs/operators';


const apiUrl = "https://use.fair-coin.org/wp-json/custom/v1/all-posts";
//const apiUrl = "http://localhost:83/wp-json/custom/v1/all-posts";

// Haversine formula to calculate distance roughly
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  items$: Observable<any>;
  public responseCache = new Map();
  searching: boolean;

  constructor(private http: HttpClient) {
  }

  public getGeoJSON(): Observable<any> {
    if (!this.items$) {
      this.items$ = this.http.get<any>(apiUrl)
        .pipe(shareReplay(1),
          //.pipe(refCount());
          map(res => res.response)
        );
    }
    return this.items$;
  }

  sortNearBy(lat, lon): Observable<any> {
    console.log("sortNearBy: ", lat, lon);
    this.searching = true;
    return this.items$.pipe(
      map(res => {
        res.forEach(element => {
          element.geometry.distance = getDistanceFromLatLonInKm(element.geometry.coordinates[1], element.geometry.coordinates[0], lat,  lon).toFixed(2);
        })
        let nearby = res.sort(function(obj1, obj2) {
          // Ascending: less distance first
          return obj1.geometry.distance - obj2.geometry.distance;
        });
        return of(false); // done searching
      })
    );
  }



  filterItems(searchTerm) {
    console.log("filterItems called");
    if(this.items$===undefined) {
      console.log("No items to search through");
      return true;
    }

    console.log( this.items$ );
    const results = [];
    return this.items$.pipe(
      map(items =>
        items.filter(item => (
          item.properties.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
          || item.properties.description.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
          || item.properties.address.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1)
        )
      )
    )
  }
}
