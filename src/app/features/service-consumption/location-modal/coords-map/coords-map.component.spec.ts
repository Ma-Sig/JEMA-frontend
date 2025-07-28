import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordsMapComponent } from './coords-map.component';

describe('CoordsMapComponent', () => {
  let component: CoordsMapComponent;
  let fixture: ComponentFixture<CoordsMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoordsMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoordsMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
