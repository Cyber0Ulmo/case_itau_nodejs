import { Cliente } from '../../domain/entities/Cliente.js';
import { IClienteRepository } from '../../infrastructure/repositories/ClienteRepository.js';
import { AppError } from '../../shared/errors/AppError.js';

export class ClienteCRUDService {
  constructor(private clienteRepository: IClienteRepository) {}

  async listarClientes(): Promise<Cliente[]> {
    try {
      return await this.clienteRepository.findAll();
    } catch (error) {
      throw new AppError('Erro ao listar clientes', 500);
    }
  }

  async obterCliente(id: number): Promise<Cliente> {
    try {
      const cliente = await this.clienteRepository.findById(id);
      if (!cliente) {
        throw new AppError('Cliente não encontrado', 404);
      }
      return cliente;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar cliente', 500);
    }
  }

  async criarCliente(nome: string, email: string): Promise<Cliente> {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new AppError('Email inválido', 400);
      }

      const clienteExistente = await this.clienteRepository.findByEmail(email);
      if (clienteExistente) {
        throw new AppError('Email já cadastrado', 400);
      }

      if (nome.length < 3) {
        throw new AppError('Nome deve ter pelo menos 3 caracteres', 400);
      }

      const cliente = new Cliente(0, nome, email, 0);
      return await this.clienteRepository.create(cliente);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao criar cliente', 500);
    }
  }

  async atualizarCliente(id: number, nome?: string, email?: string): Promise<Cliente> {
    try {
      await this.obterCliente(id);

      const dadosAtualizacao: Partial<Cliente> = {};

      if (nome !== undefined) {
        if (nome.length < 3) {
          throw new AppError('Nome deve ter pelo menos 3 caracteres', 400);
        }
        dadosAtualizacao.nome = nome;
      }

      if (email !== undefined) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          throw new AppError('Email inválido', 400);
        }

        const clienteComEmail = await this.clienteRepository.findByEmail(email);
        if (clienteComEmail && clienteComEmail.id !== id) {
          throw new AppError('Email já está em uso por outro cliente', 400);
        }

        dadosAtualizacao.email = email;
      }

      if (Object.keys(dadosAtualizacao).length === 0) {
        throw new AppError('Nenhum dado fornecido para atualização', 400);
      }

      return await this.clienteRepository.update(id, dadosAtualizacao);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao atualizar cliente', 500);
    }
  }

  async excluirCliente(id: number): Promise<boolean> {
    try {
      await this.obterCliente(id);
      return await this.clienteRepository.delete(id);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao excluir cliente', 500);
    }
  }
}