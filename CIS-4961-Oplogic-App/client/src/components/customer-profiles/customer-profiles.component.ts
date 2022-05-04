import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Customer, Reference } from 'src/../../shared/models/Model';
import { SocketService } from 'src/services/socketService/socket.service';

@Component({
    selector: 'app-customer-profiles',
    templateUrl: './customer-profiles.component.html',
    styleUrls: ['./customer-profiles.component.css'],
})
export class CustomerProfilesComponent implements OnInit {
    private references: Reference[] = [];
    customers: Customer[] = [];

    constructor(
        private socket: SocketService,
        public modalController: ModalController
    ) {
        this.socket.requestAllCustomerProfiles();

        let s = socket.receiveAllCustomerProfiles.subscribe((customers) => {
            this.customers = customers;
            s.unsubscribe();
        });
    }

    ngOnInit(): void {
        var input = document.getElementById('search');
        // if (input) {
        //     input.onkeyup((ev: KeyboardEvent) => {
        //         let value = input?.textContent;

        //         return;
        //     });
        // }

         input!.addEventListener('keyup', function () {
             var value = (<HTMLInputElement>input!).value;
             var filter, table, tr, td, i, txtValue;
             filter = value.toUpperCase();
             table = document.getElementById('customer_info');
             tr = table!.getElementsByTagName('tr');
             // Loop through all table rows, and hide those who don't match the search query
             for (i = 0; i < tr.length; i++) {
                 td = tr[i].getElementsByTagName('td')[1];
                 if (td) {
                   txtValue = td.textContent || td.innerText;
                     if (txtValue.toUpperCase().indexOf(filter) > -1) {
                         tr[i].style.display = '';
                     } else {
                         tr[i].style.display = 'none';
                     }
                 }
             }
         });
    }

    onCancel() {
        this.modalController.dismiss({
            'dismissed': true
        });
    }
    onSubmit() {
        this.references = [];
        var checkboxes = document.querySelectorAll(
            'input[type="checkbox"]:checked'
        );

        checkboxes.forEach((e) => {
            const cid: number = parseInt(e.id);
            const cust = this.customers.find((c) => c.pkindex == cid);
            let ref = new Reference().fromCustomer(
                this.socket.currentChannel.id as number,
                cust as Customer
            );

            this.references.push(ref);
        });

        if (this.references.length) {
            this.socket.sendReferences(this.references);
        }

        this.modalController.dismiss({
            'dismissed': true
        });
    }
}
