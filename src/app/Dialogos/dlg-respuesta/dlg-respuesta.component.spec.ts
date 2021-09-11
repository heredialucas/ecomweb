import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DlgRespuestaComponent } from './dlg-respuesta.component';

describe('DlgRespuestaComponent', () => {
  let component: DlgRespuestaComponent;
  let fixture: ComponentFixture<DlgRespuestaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DlgRespuestaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DlgRespuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
