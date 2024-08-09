import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConfigPageComponent } from './add-config-page.component';

describe('AddConfigPageComponent', () => {
  let component: AddConfigPageComponent;
  let fixture: ComponentFixture<AddConfigPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddConfigPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddConfigPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
