import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cliente } from '../../models/cliente.model';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cliente-list.html',
  styleUrl: './cliente-list.scss'
})
export class ClienteListComponent implements OnInit {
  clientes: Cliente[] = [];
  carregando: boolean = false;
  erro: string = '';

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.carregarClientes();
  }

  carregarClientes(): void {
    this.carregando = true;
    this.erro = '';

    this.clienteService.getClientes().subscribe({
      next: (response) => {
        if (response.success) {
          this.clientes = response.data;
        }
        this.carregando = false;
      },
      error: (error) => {
        this.erro = 'Erro ao carregar clientes: ' + error.message;
        this.carregando = false;
        console.error('Erro:', error);
      }
    });
  }

  excluirCliente(id: number): void {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      this.clienteService.excluirCliente(id).subscribe({
        next: (response) => {
          if (response.success) {
            this.carregarClientes();
          }
        },
        error: (error) => {
          alert('Erro ao excluir cliente: ' + error.error?.error || error.message);
        }
      });
    }
  }

  formatarSaldo(saldo: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(saldo);
  }
}