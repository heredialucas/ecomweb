import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViajanteComponent } from './viajante.component';

describe('ViajanteComponent', () => {
  let component: ViajanteComponent;
  let fixture: ComponentFixture<ViajanteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViajanteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViajanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
