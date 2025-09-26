import sqlite3 from 'sqlite3';
import { Cliente } from '../../domain/entities/Cliente.js';
import { AppError } from '../../shared/errors/AppError.js';

export interface IClienteRepository {
  findAll(): Promise<Cliente[]>;
  findById(id: number): Promise<Cliente | null>;
  findByEmail(email: string): Promise<Cliente | null>;
  create(clienteData: Omit<Cliente, 'id'>): Promise<Cliente>;
  update(id: number, clienteData: Partial<Cliente>): Promise<Cliente>;
  delete(id: number): Promise<boolean>;
  atualizarSaldo(id: number, novoSaldo: number): Promise<Cliente>;
}

export class ClienteRepository implements IClienteRepository {
  constructor(private db: sqlite3.Database) {}

  private rowToCliente(row: any): Cliente {
    return new Cliente(row.id, row.nome, row.email, row.saldo);
  }

  async findAll(): Promise<Cliente[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM clientes', [], (err, rows) => {
        if (err) {
          reject(new AppError(`Erro ao buscar clientes: ${err.message}`, 500));
          return;
        }
        resolve(rows.map(this.rowToCliente));
      });
    });
  }

  async findById(id: number): Promise<Cliente | null> {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM clientes WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(new AppError(`Erro ao buscar cliente: ${err.message}`, 500));
          return;
        }
        resolve(row ? this.rowToCliente(row) : null);
      });
    });
  }

  async findByEmail(email: string): Promise<Cliente | null> {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM clientes WHERE email = ?', [email], (err, row) => {
        if (err) {
          reject(new AppError(`Erro ao buscar cliente por email: ${err.message}`, 500));
          return;
        }
        resolve(row ? this.rowToCliente(row) : null);
      });
    });
  }

  async create(clienteData: Omit<Cliente, 'id'>): Promise<Cliente> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO clientes (nome, email, saldo) VALUES (?, ?, ?)',
        [clienteData.nome, clienteData.email, clienteData.saldo || 0],
        function (err) {
          if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
              reject(new AppError('Email já cadastrado', 400));
              return;
            }
            reject(new AppError(`Erro ao criar cliente: ${err.message}`, 500));
            return;
          }
          resolve(new Cliente(this.lastID, clienteData.nome, clienteData.email, clienteData.saldo || 0));
        }
      );
    });
  }

  async update(id: number, clienteData: Partial<Cliente>): Promise<Cliente> {
    const fields: string[] = [];
    const values: any[] = [];

    if (clienteData.nome !== undefined) {
      fields.push('nome = ?');
      values.push(clienteData.nome);
    }
    if (clienteData.email !== undefined) {
      fields.push('email = ?');
      values.push(clienteData.email);
    }
    if (clienteData.saldo !== undefined) {
      fields.push('saldo = ?');
      values.push(clienteData.saldo);
    }

    if (fields.length === 0) {
      throw new AppError('Nenhum campo para atualizar', 400);
    }

    values.push(id);

    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE clientes SET ${fields.join(', ')} WHERE id = ?`,
        values,
        async (err) => {
          if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
              reject(new AppError('Email já cadastrado', 400));
              return;
            }
            reject(new AppError(`Erro ao atualizar cliente: ${err.message}`, 500));
            return;
          }
          
          const clienteAtualizado = await this.findById(id);
          if (!clienteAtualizado) {
            reject(new AppError('Cliente não encontrado após atualização', 404));
            return;
          }
          resolve(clienteAtualizado);
        }
      );
    });
  }

  async delete(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM clientes WHERE id = ?', [id], function (err) {
        if (err) {
          reject(new AppError(`Erro ao deletar cliente: ${err.message}`, 500));
          return;
        }
        resolve(this.changes > 0);
      });
    });
  }

  async atualizarSaldo(id: number, novoSaldo: number): Promise<Cliente> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'UPDATE clientes SET saldo = ? WHERE id = ?',
        [novoSaldo, id],
        async (err) => {
          if (err) {
            reject(new AppError(`Erro ao atualizar saldo: ${err.message}`, 500));
            return;
          }
          
          const cliente = await this.findById(id);
          if (!cliente) {
            reject(new AppError('Cliente não encontrado', 404));
            return;
          }
          resolve(cliente);
        }
      );
    });
  }
}