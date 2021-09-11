import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViaDocInfoComponent } from './via-doc-info.component';

describe('ViaDocInfoComponent', () => {
  let component: ViaDocInfoComponent;
  let fixture: ComponentFixture<ViaDocInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViaDocInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViaDocInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
