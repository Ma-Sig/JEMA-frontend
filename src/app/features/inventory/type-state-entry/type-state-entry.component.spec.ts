import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeStateEntryComponent } from './type-state-entry.component';

describe('TypeStateEntryComponent', () => {
  let component: TypeStateEntryComponent;
  let fixture: ComponentFixture<TypeStateEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeStateEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeStateEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
