import { Component, ViewChild, ElementRef } from '@angular/core';
import { Platform } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { latLng, tileLayer } from 'leaflet';
import { HttpClient } from '@angular/common/http';
//import { map } from 'rxjs/operators';
import leaflet from 'leaflet';
import { PopoverPage } from './../popover/popover.page';
import { DataService } from '../providers/data.service';
import { map } from 'rxjs/operators';

declare let L;
import 'leaflet';
import 'leaflet.markercluster';
declare var jQuery: any;



function hexToRGBA(hex,opacity){
  hex = hex.replace('#','');
  var r = parseInt(hex.substring(0,2), 16);
  var g = parseInt(hex.substring(2,4), 16);
  var b = parseInt(hex.substring(4,6), 16);

  var result = 'rgba('+r+','+g+','+b+','+opacity+')';
  return result;
}

var text_truncate = function(str, length, ending) {
  if (length == null) {
    length = 100;
  }
  if (ending == null) {
    ending = '...';
  }
  if (str.length > length) {
    return str.substring(0, length - ending.length) + ending;
  } else {
    return str;
  }
};

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  @ViewChild('map') mapContainer: ElementRef;
  markers: {};
  map: any;
  iconUfcSpot: any
  iconYellow: any
  iconSelf: any
  myMarker: any;
  locations: any;
  selflayer: any;
  layers: any;
  items$: any;

  constructor(public http: HttpClient,
    private popoverController: PopoverController,
    public platform: Platform,
    public dataService: DataService
  ) {
    this.iconUfcSpot = leaflet.icon({
      iconUrl: '/assets/imgs/ufcspot.png',
      //shadowUrl: '/assets/imgs/ufcspot-shadow.png',
      iconSize: [38, 58],
      iconAnchor: [16, 58],
      popupAnchor: [2, -58],
    });

    this.iconYellow = leaflet.icon({
      iconUrl: '/assets/imgs/yellow.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    this.iconSelf = leaflet.icon({
      iconUrl: '/assets/imgs/me.png',
      //shadowUrl: '/assets/imgs/me-shadow.png',
      iconSize: [38, 58],
      iconAnchor: [16, 58],
    });
  }

  ngOnInit() {
    this.map = leaflet.map("map")
  }

  ionViewDidEnter() {
    this.loadmap();
  }

  loadmap() {
    this.map.fitWorld().zoomIn();

    leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attributions: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18
    }).addTo(this.map);
    this.addMyMarker();
    this.locations = leaflet.markerClusterGroup();

    this.dataService.getGeoJSON().subscribe(res => {
      this.updateMarkers(res);
    });
  }

  updateMarkers(items) {
    var marker = {};
    var description = "";
    items.forEach(item => {
      var lat = item.geometry.coordinates[1];
      var lon = item.geometry.coordinates[0];
      var img = '';
      var icon = leaflet.divIcon({
        className: 'markerInvisible',
        popupAnchor:  [10, 0], // point from which the popup should open relative to the iconAnchor
        html: `<img style='width:30px;height:30px;border: 2px solid `+item.properties.icon_marker_color+`;
        box-shadow: 0 0 5px 4px ` + hexToRGBA(item.properties.icon_marker_color, 0.2) + `
          ;' class='marker' src='statics/img/categories/` + item.properties.icon_name + `_black.svg' />`
        // html: "<img style='width:30px;height:30px;border: 2px solid " + hexToRGBA(item.properties.icon_marker_color, 0.2) + ";' class='marker marker-" + item.properties.icon_marker_color + "' src='statics/img/categories/" + item.properties.icon_name + "_black.svg' />"
      });
      marker[item.properties.id] = leaflet.marker([lat, lon], {icon: this.iconUfcSpot});

      if(item.properties.description!=null) {
        description = `<div>`+text_truncate(item.properties.description, 200, "...")+`</div>`;
      }

      // Create an element to hold all your text and markup
      var container = jQuery('<div />');

      // Delegate all event handling for the container itself and its contents to the container
      container.on('click', '.more-info-button', () => {
        this.openPopover(item);
      });

      // Insert whatever you want into the container, using whichever approach you prefer
      container.html(`<div><b>`+item.properties.name+`</b><br/>`+description+`</div>`);
      container.append(`<ion-button class="more-info-button" expand="full">More info</ion-button>`);

      // Insert the container into the popup
      marker[item.properties.id].bindPopup(container[0]);

      marker[item.properties.id].on('mouseover', function(e) {
        //this.openPopup();
      });
      marker[item.properties.id].on('mouseout', function(e) {
        //this.closePopup();
      });
      marker[item.properties.id].on('click', function(e) {
        // show popup?
        this.openPopup();
      });
      marker[item.properties.id].addTo(this.locations);
    });
    this.map.addLayer(this.locations);
  }

  addMyMarker() {
    this.map.locate({
      watch: true,
      setView: false,
      maxZoom: 18
    }).on('locationfound', (e) => {
      this.dataService.sortNearBy(e.latitude, e.longitude);
      this.selflayer = leaflet.featureGroup();
      this.map.addLayer(this.selflayer);

      if(this.myMarker) {
        console.log("* Updating marker to: ", e.latitude, e.longitude);
        // Update marker position
        this.myMarker.setLatLng([e.latitude, e.longitude]);
        this.myMarker.setIcon(this.iconSelf);
      } else {
        this.map.setView([e.latitude, e.longitude], 5);
        // Create marker
        this.myMarker = leaflet.marker([e.latitude, e.longitude], {icon: this.iconSelf}).on('click', function(e) {
          this.openPopup();
        });
        this.myMarker.setZIndexOffset(1);
      }
      this.selflayer.addLayer(this.myMarker);
    }).on('locationerror', (err) => {
      console.log("ERROR: ", err.message);
    })

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

  async openPopover(data) {
    const popover = await this.popoverController.create({
      component: PopoverPage,
      //event: ev,
      componentProps: {
        item: data
      },
      cssClass: 'custom-popover'
    });
    await popover.present();
  }
}
