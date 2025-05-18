import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumptionEntryComponent } from './consumption-entry.component';

describe('ConsumptionEntryComponent', () => {
  let component: ConsumptionEntryComponent;
  let fixture: ComponentFixture<ConsumptionEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumptionEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumptionEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
