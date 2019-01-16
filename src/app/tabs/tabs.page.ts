import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController } from '@ionic/angular';
import leaflet from 'leaflet';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import gql from 'graphql-tag';
import mutation from 'graphql-tag';

import { Course, Query } from '../types';

const login = gql`
	mutation submitRepository {
		createToken(username: "rama", password: "asdasdasd") {
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
  private querySubscription: Subscription;

	constructor(private apollo: Apollo, public navCtrl: NavController) { }

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
      });
	}

  ionViewDidEnter() {
    this.loadmap();
  }

  loadmap() {
    this.map = leaflet.map("map").fitWorld();
    leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attributions: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18
    }).addTo(this.map);
    this.map.locate({
      setView: true,
      maxZoom: 10
    }).on('locationfound', (e) => {
      let markerGroup = leaflet.featureGroup();
      let marker: any = leaflet.marker([e.latitude, e.longitude]).on('click', () => {
        alert('Marker clicked');
      })
      markerGroup.addLayer(marker);
      this.map.addLayer(markerGroup);
      }).on('locationerror', (err) => {
        alert(err.message);
    })

  }
}
