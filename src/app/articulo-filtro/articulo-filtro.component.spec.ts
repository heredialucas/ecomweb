import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticuloFiltroComponent } from './articulo-filtro.component';

describe('ArticuloFiltroComponent', () => {
  let component: ArticuloFiltroComponent;
  let fixture: ComponentFixture<ArticuloFiltroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticuloFiltroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticuloFiltroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
