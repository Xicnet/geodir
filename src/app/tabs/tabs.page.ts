import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController,AlertController,ModalController } from '@ionic/angular';
import leaflet from 'leaflet';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { InfoModule } from '../info/info.module'

import gql from 'graphql-tag';
import mutation from 'graphql-tag';

import { Course, Query } from '../types';

const login = gql`
  mutation submitRepository {
    createToken(username: "admin", password: "ufcaufca") {
      token
    }
  }
`;

const listings = gql`
query($token: String) {
  viewer(token: $token) {
    allUfcs {
      id
      title
      tagline
      description
      address
      hours
      phone
      website
      twitter
      faircoinAddress
      lat
      lng
      image
    }
  }
}
`;

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
  markerGroup: any;
  markers = {};
  private querySubscription: Subscription;

  constructor(private apollo: Apollo, public navCtrl: NavController, private modalCtrl: ModalController) {
    this.showInfoPage();

    this.iconUfcSpot = leaflet.icon({
      iconUrl: '/assets/imgs/ufcspot.png',
      shadowUrl: '/assets/imgs/ufcspot-shadow.png',
      iconSize: [64, 50],
      iconAnchor: [32, 64],
    });

    this.iconYellow = leaflet.icon({
      iconUrl: '/assets/imgs/yellow.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    this.iconSelf = leaflet.icon({
      iconUrl: '/assets/imgs/me.png',
      shadowUrl: '/assets/imgs/me-shadow.png',
      iconAnchor: [128, 100],
    });
  }

  ngOnInit() {
    this.getToken();
    console.log("Token: ", this.token);
  }

  getToken() {
    console.log("* Getting token");
    this.apollo.mutate<any>({
      mutation: login
    }).subscribe(({ data }) => {
      console.log('got data', data);
      let token = data.createToken.token;
      this.getListing(token);
    },(error) => {
      console.log('there was an error sending the query', error);
    });
  }

  async showInfoPage() {
    let addressModal = await this.modalCtrl.create({
         component: InfoModule
       });
    await addressModal.present();
  }

getListing(token) {
  console.log("* Getting listing");
  this.querySubscription = this.apollo
    .watchQuery({
      query: listings,
      variables: {
        token: token,
      },
    })
    .valueChanges.subscribe(({data}) => {
      console.log("Listing data: ", data);
      this.setMarkers(data);
    });
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
}

addMyMarker() {
  this.map.locate({
    watch: true,
    setView: false,
    maxZoom: 18
  }).on('locationfound', (e) => {
    this.markerGroup = leaflet.featureGroup();
    this.map.addLayer(this.markerGroup);
    if(this.myMarker) {
      console.log("* Updating marker");
      // Update marker position
      this.myMarker.setLatLng([e.latitude, e.longitude]);
      this.myMarker.setZIndexOffset(999999);
      this.myMarker.setIcon(this.iconSelf);
    } else {
      this.map.setView([e.latitude, e.longitude], 18);
      // Create marker
      this.myMarker = leaflet.marker([e.latitude, e.longitude], {icon: this.iconSelf}).on('click', () => {
        this.myMarker.setZIndexOffset(999999);
        alert("We are all over");
      });
    }
    this.markerGroup.addLayer(this.myMarker);
  }).on('locationerror', (err) => {
    console.log("ERROR: ", err.message);
  })

}

setMarkers(data) {
  // Loop over the data array and handle each object
  data.viewer.allUfcs.forEach(location => {
    // Check if there is already a marker with that id in the markers object
    if(!this.markers.hasOwnProperty(location.id)) {
      this.markers[location.id] = leaflet.marker([location.lat, location.lng], {icon: this.iconUfcSpot}).on('click', () => {
        this.myMarker.setZIndexOffset(999999);
        alert(location.title+"\n\n...more features soon..");
      });
      this.markers[location.id].addTo(this.markerGroup);
    }
  });
}

}
