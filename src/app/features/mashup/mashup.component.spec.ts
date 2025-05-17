import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MashupComponent } from './mashup.component';

describe('MashupComponent', () => {
  let component: MashupComponent;
  let fixture: ComponentFixture<MashupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MashupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MashupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
