import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuGestionComponent } from './usu-gestion.component';

describe('UsuGestionComponent', () => {
  let component: UsuGestionComponent;
  let fixture: ComponentFixture<UsuGestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuGestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuGestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
