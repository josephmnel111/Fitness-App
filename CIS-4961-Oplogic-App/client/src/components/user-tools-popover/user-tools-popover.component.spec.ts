import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserToolsPopoverComponent } from './user-tools-popover.component';

describe('UserToolsPopoverComponent', () => {
  let component: UserToolsPopoverComponent;
  let fixture: ComponentFixture<UserToolsPopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserToolsPopoverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserToolsPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
