import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChannelPanelComponent } from './add-channel-panel.component';

describe('AddChannelPanelComponent', () => {
  let component: AddChannelPanelComponent;
  let fixture: ComponentFixture<AddChannelPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddChannelPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddChannelPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
