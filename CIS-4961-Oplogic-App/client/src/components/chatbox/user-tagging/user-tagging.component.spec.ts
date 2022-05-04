import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTaggingComponent } from './user-tagging.component';

describe('UserTaggingComponent', () => {
  let component: UserTaggingComponent;
  let fixture: ComponentFixture<UserTaggingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserTaggingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTaggingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
