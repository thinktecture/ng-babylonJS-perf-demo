import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NaiveComponent } from './naive.component';

describe('NaiveComponent', () => {
  let component: NaiveComponent;
  let fixture: ComponentFixture<NaiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NaiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NaiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
