import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightQComponent } from './right-q.component';

describe('RightQComponent', () => {
  let component: RightQComponent;
  let fixture: ComponentFixture<RightQComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RightQComponent]
    });
    fixture = TestBed.createComponent(RightQComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
