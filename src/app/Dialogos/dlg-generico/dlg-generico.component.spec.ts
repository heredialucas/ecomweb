import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DlgGenericoComponent } from './dlg-generico.component';

describe('DlgGenericoComponent', () => {
  let component: DlgGenericoComponent;
  let fixture: ComponentFixture<DlgGenericoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DlgGenericoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DlgGenericoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
