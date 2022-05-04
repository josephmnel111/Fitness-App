import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentPopoverComponent } from './attachment-popover.component';

describe('AttachmentPopoverComponent', () => {
  let component: AttachmentPopoverComponent;
  let fixture: ComponentFixture<AttachmentPopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttachmentPopoverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
