import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { HttpHandler } from '@angular/common/http'
import { HttpModule } from '@angular/http'
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { ApolloModule, Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { Geolocation } from '@ionic-native/geolocation/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListComponent } from './list/list.component';

export function createApollo(httpLink: HttpLink) {
  return {
    link: httpLink.create({uri: 'https://ufcdata.thedata.me/api/graph'}),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  declarations: [AppComponent, ListComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    ApolloModule,
    HttpLinkModule,
    IonicModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink]
    },
    Geolocation,
    StatusBar,
    Apollo,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
