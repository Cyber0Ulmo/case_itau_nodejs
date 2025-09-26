import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente-form.html',
  styleUrl: './cliente-form.scss'
})
export class ClienteFormComponent {
  @Output() clienteSalvo = new EventEmitter<void>();
  
  cliente = {
    nome: '',
    email: ''
  };
  
  carregando = false;
  mensagem = '';
  tipoMensagem = '';

  constructor(private clienteService: ClienteService) {}

  onSubmit(): void {
    if (!this.cliente.nome || !this.cliente.email) {
      this.mostrarMensagem('Preencha todos os campos', 'error');
      return;
    }

    this.carregando = true;
    
    const clienteCompleto = {
      ...this.cliente,
      saldo: 0
    };
    
    this.clienteService.criarCliente(clienteCompleto).subscribe({
      next: (response) => {
        this.carregando = false;
        if (response.success) {
          this.mostrarMensagem('Cliente criado com sucesso!', 'success');
          this.cliente = { nome: '', email: '' };
          this.clienteSalvo.emit();
        }
      },
      error: (error) => {
        this.carregando = false;
        this.mostrarMensagem(error.error?.error || 'Erro ao criar cliente', 'error');
      }
    });
  }

  private mostrarMensagem(mensagem: string, tipo: string): void {
    this.mensagem = mensagem;
    this.tipoMensagem = tipo;
    setTimeout(() => this.mensagem = '', 5000);
  }
}