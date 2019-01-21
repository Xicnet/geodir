import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController, ModalController, PopoverController } from '@ionic/angular';
import leaflet from 'leaflet';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import gql from 'graphql-tag';
import mutation from 'graphql-tag';

import { Course, Query } from '../types';

import { PopoverPage } from '../popover/popover.page';


function hexToRGBA(hex,opacity){
  hex = hex.replace('#','');
  var r = parseInt(hex.substring(0,2), 16);
  var g = parseInt(hex.substring(2,4), 16);
  var b = parseInt(hex.substring(4,6), 16);

  var result = 'rgba('+r+','+g+','+b+','+opacity+')';
  return result;
}


@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {
  @ViewChild('map') mapContainer: ElementRef;
  token: Observable<any>;
  listings: any[];
  loading = true;
  error: any;
  map: any;
  iconUfcSpot: any
  iconYellow: any
  iconSelf: any
  myMarker: any;
  selflayer: any;
  locations: any;
  markers: {};
  private querySubscription: Subscription;

  constructor(private apollo: Apollo, public navCtrl: NavController, private modalCtrl: ModalController,
    private popoverController: PopoverController,
    public http: HttpClient
  ) {

    this.iconUfcSpot = leaflet.icon({
      iconUrl: '/assets/imgs/ufcspot.png',
      shadowUrl: '/assets/imgs/ufcspot-shadow.png',
      iconSize: [64, 64],
      iconAnchor: [32, 0],
      popupAnchor: [-16, 0],
    });

    this.iconYellow = leaflet.icon({
      iconUrl: '/assets/imgs/yellow.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    this.iconSelf = leaflet.icon({
      iconUrl: '/assets/imgs/me.png',
      shadowUrl: '/assets/imgs/me-shadow.png',
      iconSize: [128, 128],
      iconAnchor: [128, 100],
    });
  }

  async openPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverPage,
      event: ev,
      componentProps: {
        custom_id: 1
      }
    });
    await popover.present();
  }

  ngOnInit() {
  }

  /* Get listings using JSON */
  getListingJSON() {
    console.log("* Getting listing");
    var url = 'http://localhost:83/wp-json/custom/v1/all-posts';

    this.http.get(url)
      .subscribe(data => {
        console.log(data);
        this.updateMarkers(data);
      });
  }

  updateMarkers(items) {
    var marker = {};
    var image = "";
    var description = "";
    items.response.forEach(item => {
      var lat = item.geometry.coordinates[1];
      var lon = item.geometry.coordinates[0];
      var icon = leaflet.divIcon({
        className: 'markerInvisible',
        popupAnchor:  [10, 0], // point from which the popup should open relative to the iconAnchor
        html: `<img style='width:30px;height:30px;border: 2px solid `+item.properties.icon_marker_color+`;
        box-shadow: 0 0 5px 4px ` + hexToRGBA(item.properties.icon_marker_color, 0.2) + `
          ;' class='marker' src='statics/img/categories/` + item.properties.icon_name + `_black.svg' />`
        // html: "<img style='width:30px;height:30px;border: 2px solid " + hexToRGBA(item.properties.icon_marker_color, 0.2) + ";' class='marker marker-" + item.properties.icon_marker_color + "' src='statics/img/categories/" + item.properties.icon_name + "_black.svg' />"
      });
      marker[item.properties.id] = leaflet.marker([lat, lon], {icon: this.iconUfcSpot});

      if(item.properties.image!=null) {
        console.log( item.properties.image);
        if(item.properties.image.length) {
          image = `<img src="`+item.properties.image[0]+`"/>`;
        }
      }
      if(item.properties.description!=null) {
        description = item.properties.description;
      }

      marker[item.properties.id].bindPopup(image+"<b>"+item.properties.name+"</b><br/>"+description);

      marker[item.properties.id].on('mouseover', function(e) {
        this.openPopup();
      });
      marker[item.properties.id].on('mouseout', function(e) {
        this.closePopup();
      });
      marker[item.properties.id].on('click', function(e) {
        // show popup?
        //this.openPopup();
      });
      marker[item.properties.id].addTo(this.locations);
    });
    this.map.addLayer(this.locations);
  }

  ionViewDidEnter() {
    this.loadmap();
  }

  loadmap() {
    this.map = leaflet.map("map").fitWorld();

    leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attributions: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18
    }).addTo(this.map);
    this.addMyMarker();
    this.locations = leaflet.featureGroup();
    this.getListingJSON();
  }

  addMyMarker() {
    this.map.locate({
      watch: true,
      setView: false,
      maxZoom: 18
    }).on('locationfound', (e) => {
      this.selflayer = leaflet.featureGroup();
      this.map.addLayer(this.selflayer);

      if(this.myMarker) {
        console.log("* Updating marker");
        // Update marker position
        this.myMarker.setLatLng([e.latitude, e.longitude]);
        this.myMarker.setIcon(this.iconSelf);
      } else {
        this.map.setView([e.latitude, e.longitude], 12);
        // Create marker
        this.myMarker = leaflet.marker([e.latitude, e.longitude], {icon: this.iconSelf}).on('click', function(e) {
          this.openPopup();
        });
        this.myMarker.setZIndexOffset(999999);
      }
      this.selflayer.addLayer(this.myMarker);
    }).on('locationerror', (err) => {
      console.log("ERROR: ", err.message);
    })

  }

}
