import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Appcomponent } from './appcomponent';

describe('Appcomponent', () => {
  let component: Appcomponent;
  let fixture: ComponentFixture<Appcomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Appcomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Appcomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
