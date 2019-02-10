import { Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ModalController } from '@ionic/angular';
import { ModalPagePage } from './../../modal-page/modal-page.page';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(
    public modalCtrl: ModalController,
    private deviceService: DeviceDetectorService,
  ) { }

  public async openModal(data) {
    let cssClass = this.deviceService.isMobile() ? '' : 'modal-smaller';
    const modalPage = await this.modalCtrl.create({
      component: ModalPagePage,
      componentProps: {
        item: data
      },
      cssClass: cssClass
    });
    await modalPage.present();
  }

}
