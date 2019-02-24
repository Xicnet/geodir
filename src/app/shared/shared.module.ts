import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsComponent } from './details/details.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [DetailsComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [DetailsComponent]
})
export class SharedModule { }
