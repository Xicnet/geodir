import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    public navCtrl: NavController,
    private router: Router
  ) { }

  ngOnInit() {
    this.slug = this.route.snapshot.paramMap.get('slug');

    // FIXME : this should fetch the requested record instead
    this.dataService.getItemBySlug(this.slug).subscribe(item => {
      this.item = item[0];
    });

  }

  closeModal() {
    this.router.navigate(['/tabs/list', {q: this.item.properties.slug}]);
  }
  openNavigator(e, address) {
    this.links.openNavigator(address);
  }

  openLink(e, url) {
    this.links.openLink(url);
  }

  openTwitter(e, url) {
    this.links.openTwitter(url);
  }

  geoZoom(location) {
    this.navCtrl.navigate(`/tabs/map?location=${location}`, {});
  }
}
