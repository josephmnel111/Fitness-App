import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMessagePanelComponent } from './add-message-panel.component';

describe('AddMessagePanelComponent', () => {
  let component: AddMessagePanelComponent;
  let fixture: ComponentFixture<AddMessagePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMessagePanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMessagePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
