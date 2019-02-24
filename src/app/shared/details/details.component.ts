import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'listing-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  @Input() item: any;
  
  constructor() { }

  ngOnInit() {
  }

}
