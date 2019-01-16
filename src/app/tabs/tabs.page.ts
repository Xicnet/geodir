import { Component, OnInit } from '@angular/core';
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
	token: Observable<any>;
  listings: any[];
  loading = true;
  error: any;
  private querySubscription: Subscription;

	constructor(private apollo: Apollo) { }

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
}
