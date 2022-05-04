import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileReferencesComponent } from './profile-references.component';

describe('ProfileReferencesComponent', () => {
  let component: ProfileReferencesComponent;
  let fixture: ComponentFixture<ProfileReferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileReferencesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileReferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
