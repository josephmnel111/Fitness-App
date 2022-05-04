import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { NotifModalComponent } from '../notif-modal/notif-modal.component';

@Component({
  selector: 'app-user-tools-popover',
  templateUrl: './user-tools-popover.component.html',
  styleUrls: ['./user-tools-popover.component.css']
})
export class UserToolsPopoverComponent implements OnInit {

  constructor(
    public popoverController : PopoverController,
    public modalController: ModalController  
  ) { }

  ngOnInit(): void {
  }

  private closePopover() {this.popoverController.dismiss()}

  public notifClick() {
    this.closePopover()
    this.presentNotificationsModal()
  }

  private async presentNotificationsModal() {
    const modal = await this.modalController.create({
      component: NotifModalComponent,
      cssClass: 'modal-notifications'
    });
    return await modal.present();
  }

}
