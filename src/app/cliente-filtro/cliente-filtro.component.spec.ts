import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteFiltroComponent } from './cliente-filtro.component';

describe('ClienteFiltroComponent', () => {
  let component: ClienteFiltroComponent;
  let fixture: ComponentFixture<ClienteFiltroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClienteFiltroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClienteFiltroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
