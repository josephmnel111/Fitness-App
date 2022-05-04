import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelToolsPopoverComponent } from './channel-tools-popover.component';

describe('ChannelToolsPopoverComponent', () => {
  let component: ChannelToolsPopoverComponent;
  let fixture: ComponentFixture<ChannelToolsPopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelToolsPopoverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelToolsPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
