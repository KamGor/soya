import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConfigPageComponent } from './edit-config-page.component';

describe('EditConfigPageComponent', () => {
  let component: EditConfigPageComponent;
  let fixture: ComponentFixture<EditConfigPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditConfigPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditConfigPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
