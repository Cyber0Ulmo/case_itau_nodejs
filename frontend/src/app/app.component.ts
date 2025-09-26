import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteListComponent } from './components/cliente-list/cliente-list';
import { ClienteFormComponent } from './components/cliente-form/cliente-form';
import { OperacoesFinanceirasComponent } from './components/operacoes-financeiras/operacoes-financeiras';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ClienteListComponent,
    ClienteFormComponent,
    OperacoesFinanceirasComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Sistema de Clientes';
}