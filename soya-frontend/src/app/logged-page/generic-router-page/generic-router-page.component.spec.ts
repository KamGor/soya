import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericRouterPageComponent } from './generic-router-page.component';

describe('GenericRouterPageComponent', () => {
  let component: GenericRouterPageComponent;
  let fixture: ComponentFixture<GenericRouterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenericRouterPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenericRouterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
