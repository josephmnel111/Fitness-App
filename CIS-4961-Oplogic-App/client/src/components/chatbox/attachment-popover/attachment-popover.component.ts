import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { CustomerProfilesComponent } from 'src/components/customer-profiles/customer-profiles.component';
import { PopoverActions } from '../chatbox.component';

@Component({
  selector: 'app-attachment-popover',
  templateUrl: './attachment-popover.component.html',
  styleUrls: ['./attachment-popover.component.css']
})
export class AttachmentPopoverComponent implements OnInit {

  constructor(
    public popoverController : PopoverController,
    public modalController: ModalController
  ) { }

  ngOnInit(): void {
  }

  startAddFile() {
    this.close(PopoverActions.AddPicture)
  }

  startAddDoc() {this.close(PopoverActions.AddDoc)}

  async presentCustomerProfilesModal() {
    this.popoverController.dismiss();     //Close popover
    const modal = await this.modalController.create({
      component: CustomerProfilesComponent,
      cssClass: 'modal-customer-profiles',
    });
    return await modal.present();
  }


  /** Dismisses modal and returns an enum for action to take.
   * @param {PopoverActions} passbackData - Enum for action to take 
  */
  close(passbackData : PopoverActions) {
    this.popoverController.dismiss(passbackData);
  }
}
