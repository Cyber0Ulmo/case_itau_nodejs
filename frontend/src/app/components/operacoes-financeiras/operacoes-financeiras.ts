import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-operacoes-financeiras',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './operacoes-financeiras.html',
  styleUrl: './operacoes-financeiras.scss'
})
export class OperacoesFinanceirasComponent implements OnInit {
  clientes: Cliente[] = [];
  operacao = {
    tipo: 'deposito',
    clienteId: 0,
    valor: 0,
    clienteDestinoId: 0
  };
  
  carregando = false;
  mensagem = '';
  tipoMensagem = '';

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.carregarClientes();
  }

  carregarClientes(): void {
    this.clienteService.getClientes().subscribe({
      next: (response) => {
        if (response.success) {
          this.clientes = response.data;
        }
      },
      error: (error) => {
        console.error('Erro ao carregar clientes:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.operacao.clienteId === 0) {
      this.mostrarMensagem('Selecione um cliente', 'error');
      return;
    }

    if (this.operacao.valor <= 0) {
      this.mostrarMensagem('Valor deve ser maior que zero', 'error');
      return;
    }

    this.carregando = true;

    switch (this.operacao.tipo) {
      case 'deposito':
        this.realizarDeposito();
        break;
      case 'saque':
        this.realizarSaque();
        break;
      case 'transferencia':
        this.realizarTransferencia();
        break;
      default:
        this.mostrarMensagem('Tipo de operação inválido', 'error');
        this.carregando = false;
    }
  }

  realizarDeposito(): void {
    this.clienteService.depositar(this.operacao.clienteId, this.operacao.valor).subscribe({
      next: (response) => {
        this.carregando = false;
        if (response.success) {
          this.mostrarMensagem(`Depósito de R$ ${this.operacao.valor.toFixed(2)} realizado com sucesso!`, 'success');
          this.limparFormulario();
          this.carregarClientes();
          window.location.reload();
        }
      },
      error: (error) => {
        this.carregando = false;
        this.mostrarMensagem(error.error?.error || 'Erro ao realizar depósito', 'error');
      }
    });
  }

  realizarSaque(): void {
    this.clienteService.sacar(this.operacao.clienteId, this.operacao.valor).subscribe({
      next: (response) => {
        this.carregando = false;
        if (response.success) {
          this.mostrarMensagem(`Saque de R$ ${this.operacao.valor.toFixed(2)} realizado com sucesso!`, 'success');
          this.limparFormulario();
          this.carregarClientes();
          window.location.reload();
        }
      },
      error: (error) => {
        this.carregando = false;
        this.mostrarMensagem(error.error?.error || 'Erro ao realizar saque', 'error');
      }
    });
  }

  realizarTransferencia(): void {
    if (this.operacao.clienteDestinoId === 0) {
      this.mostrarMensagem('Selecione o cliente destino', 'error');
      this.carregando = false;
      return;
    }

    if (this.operacao.clienteId === this.operacao.clienteDestinoId) {
      this.mostrarMensagem('Não é possível transferir para a mesma conta', 'error');
      this.carregando = false;
      return;
    }

    const transferencia = {
      idOrigem: this.operacao.clienteId,
      idDestino: this.operacao.clienteDestinoId,
      valor: this.operacao.valor
    };

    this.clienteService.transferir(transferencia).subscribe({
      next: (response) => {
        this.carregando = false;
        if (response.success) {
          this.mostrarMensagem(`Transferência de R$ ${this.operacao.valor.toFixed(2)} realizada com sucesso!`, 'success');
          this.limparFormulario();
          this.carregarClientes();
          window.location.reload();
        }
      },
      error: (error) => {
        this.carregando = false;
        this.mostrarMensagem(error.error?.error || 'Erro ao realizar transferência', 'error');
      }
    });
  }

  limparFormulario(): void {
    this.operacao.valor = 0;
    this.operacao.clienteDestinoId = 0;
  }

  private mostrarMensagem(mensagem: string, tipo: string): void {
    this.mensagem = mensagem;
    this.tipoMensagem = tipo;
    setTimeout(() => this.mensagem = '', 5000);
  }
}