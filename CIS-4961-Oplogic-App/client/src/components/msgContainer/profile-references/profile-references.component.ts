import { Component, Input, OnInit } from '@angular/core';
import { Reference } from 'src/../../shared/models/Model';

@Component({
    selector: 'app-profile-references',
    templateUrl: './profile-references.component.html',
    styleUrls: ['./profile-references.component.css'],
})
export class ProfileReferencesComponent implements OnInit {
    @Input() public reference!: Reference;

    constructor() {}

    ngOnInit(): void {}
}
