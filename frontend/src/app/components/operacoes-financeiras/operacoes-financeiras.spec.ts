import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperacoesFinanceiras } from './operacoes-financeiras';

describe('OperacoesFinanceiras', () => {
  let component: OperacoesFinanceiras;
  let fixture: ComponentFixture<OperacoesFinanceiras>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperacoesFinanceiras]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperacoesFinanceiras);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
