import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LinksService } from '../providers/links/links.service';
import { NavController } from '@ionic/angular';
import { DataService } from '../providers/data.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  slug: string;
  item = null;

  constructor(
    private route: ActivatedRoute,
    public links: LinksService,
    public dataService: DataService,
    public navCtrl: NavController
  ) { }

  ngOnInit() {
    this.slug = this.route.snapshot.paramMap.get('slug');
       //item.properties.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
    this.dataService.getItemBySlug(this.slug).subscribe(item => {
      console.log("item: ", item[0]);
      this.item = item[0];
    });

  }

  openNavigator(e, address) {
    this.links.openNavigator(address);
  }

  openLink(e, url) {
    this.links.openLink(url);
  }

  geoZoom(location) {
    this.navCtrl.navigate(`/tabs/map?location=${location}`, {});
  }
}
