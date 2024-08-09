import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTagPageComponent } from './add-tag-page.component';

describe('AddTagPageComponent', () => {
  let component: AddTagPageComponent;
  let fixture: ComponentFixture<AddTagPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddTagPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddTagPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
