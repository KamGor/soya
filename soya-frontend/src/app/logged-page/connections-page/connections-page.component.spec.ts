import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionsPageComponent } from './connections-page.component';

describe('ConnectionsPageComponent', () => {
  let component: ConnectionsPageComponent;
  let fixture: ComponentFixture<ConnectionsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConnectionsPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConnectionsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
