import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import gql from 'graphql-tag';

import { Course, Query } from '../types';

/*

mutation {
  createToken(username: "testUser11222", password: "123456") {
    token
  }
}
const query1($token: String) {
  viewer(token: $token) {
    ufc(id:1) {
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

const query($token: String) {
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

*/

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  courses: Observable<any>;
  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.courses = this.apollo.watchQuery<any>({
      query: gql`
mutation {
  createToken(username: "rama", password: "asdasdasd") {
    token
  }
}
      `
/*
        query allCourses {
          allCourses {
            id
            title
            author
            description
            topic
            url
          }
        }
*/
    })
      .valueChanges
      .pipe(
        map(result => result.data.allCourses)
      );
  }
}
