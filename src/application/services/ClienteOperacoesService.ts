import { Cliente } from '../../domain/entities/Cliente.js';
import { IClienteRepository } from '../../infrastructure/repositories/ClienteRepository.js';
import { AppError } from '../../shared/errors/AppError.js';

export class ClienteOperacoesService {
  constructor(private clienteRepository: IClienteRepository) {}

  async depositar(id: number, valor: number): Promise<Cliente> {
    if (valor <= 0) {
    throw new AppError('Valor do depósito deve ser positivo', 400);
    }
    if (valor > 1000000) { 
    throw new AppError('Valor do depósito excede o limite permitido', 400);
    }
    try {
      const cliente = await this.obterCliente(id);
      
      cliente.depositar(valor);
      
      return await this.clienteRepository.atualizarSaldo(id, cliente.saldo);
    } catch (error) {
      this.handleOperacaoError(error, 'deposito');
    }
  }

  async sacar(id: number, valor: number): Promise<Cliente> {
    try {
      const cliente = await this.obterCliente(id);
      
      cliente.sacar(valor);
      
      return await this.clienteRepository.atualizarSaldo(id, cliente.saldo);
    } catch (error) {
      this.handleOperacaoError(error, 'saque');
    }
  }

  async obterSaldo(id: number): Promise<number> {
    try {
      const cliente = await this.obterCliente(id);
      return cliente.saldo;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao obter saldo', 500);
    }
  }

  async transferir(origemId: number, destinoId: number, valor: number): Promise<{ origem: Cliente; destino: Cliente }> {
    try {
      if (origemId === destinoId) {
        throw new AppError('Não é possível transferir para a mesma conta', 400);
      }

      const clienteOrigem = await this.obterCliente(origemId);
      const clienteDestino = await this.obterCliente(destinoId);

      clienteOrigem.sacar(valor);
      clienteDestino.depositar(valor);

      const origemAtualizada = await this.clienteRepository.atualizarSaldo(origemId, clienteOrigem.saldo);
      const destinoAtualizada = await this.clienteRepository.atualizarSaldo(destinoId, clienteDestino.saldo);

      return { origem: origemAtualizada, destino: destinoAtualizada };
    } catch (error) {
      this.handleOperacaoError(error, 'transferência');
    }
  }

  private async obterCliente(id: number): Promise<Cliente> {
    const cliente = await this.clienteRepository.findById(id);
    if (!cliente) {
      throw new AppError('Cliente não encontrado', 404);
    }
    return cliente;
  }

  private handleOperacaoError(error: unknown, operacao: string): never {
    if (error instanceof AppError) throw error;
    
    if (error instanceof Error) {
      if (error.message.includes('deve ser positivo')) {
        throw new AppError(`Valor da ${operacao} deve ser positivo`, 400);
      }
      if (error.message.includes('Saldo insuficiente')) {
        throw new AppError(`Saldo insuficiente para realizar o ${operacao}`, 400);
      }
    }
    
    throw new AppError(`Erro ao realizar ${operacao}`, 500);
  }
}