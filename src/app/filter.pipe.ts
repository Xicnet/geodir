import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from './providers/data.service';

@Pipe({
  name: 'filter'
})
export class FilterPipe {
  constructor(private dataService: DataService) {}

  //transform(value: any, filterTerm: string): Observable<any[]> {
   // return this.dataService.filterCountries(filterTerm);
 // }
}
