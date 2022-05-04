import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgPopoverComponent } from './msg-popover.component';

describe('MsgPopoverComponent', () => {
  let component: MsgPopoverComponent;
  let fixture: ComponentFixture<MsgPopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsgPopoverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsgPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
