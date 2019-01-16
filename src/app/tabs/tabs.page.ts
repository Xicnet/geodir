import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
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

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {
  courses: Observable<any>;
  constructor(private apollo: Apollo) { }

  ngOnInit() {
    console.log("bla");
    this.apollo.mutate<any>({
      mutation: login
    }).subscribe(({ data }) => {
      console.log('got data', data);
    },(error) => {
      console.log('there was an error sending the query', error);
    });
  }
}
