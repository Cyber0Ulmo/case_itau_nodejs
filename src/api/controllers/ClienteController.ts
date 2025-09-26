import { Request, Response } from 'express';
import { ClienteCRUDService } from '../../application/services/ClienteCRUDService.js';
import { ClienteOperacoesService } from '../../application/services/ClienteOperacoesService.js';
import { CriarClienteDTO } from '../../application/dtos/CriarClienteDTO.js';
import { AtualizarClienteDTO } from '../../application/dtos/AtualizarClienteDTO.js';
import { OperacaoFinanceiraDTO } from '../../application/dtos/OperacaoFinanceiraDTO.js';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { AppError } from '../../shared/errors/AppError.js';

export class ClienteController {
  constructor(
    private clienteCRUDService: ClienteCRUDService,
    private clienteOperacoesService: ClienteOperacoesService
  ) {}

  private async validateDto<T>(dtoClass: new () => T, data: any): Promise<T> {
    const dto = plainToInstance(dtoClass, data);
    const errors = await validate(dto as any);
    
    if (errors.length > 0) {
      const errorMessages = errors.flatMap(error => 
        Object.values(error.constraints || {})
      );
      throw new AppError(errorMessages.join(', '), 400);
    }
    
    return dto;
  }

  private parseId(id: string | undefined): number {
    if (!id) {
      throw new AppError('ID é obrigatório', 400);
    }
    
    const parsedId = parseInt(id);
    if (isNaN(parsedId) || parsedId <= 0) {
      throw new AppError('ID deve ser um número positivo', 400);
    }
    return parsedId;
  }

  async listarClientes(req: Request, res: Response) {
    try {
      const clientes = await this.clienteCRUDService.listarClientes();
      res.json({
        success: true,
        data: clientes,
        count: clientes.length
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({ 
        success: false,
        error: error.message 
      });
    }
  }

  async obterCliente(req: Request, res: Response) {
    try {
      const id = this.parseId(req.params.id);
      const cliente = await this.clienteCRUDService.obterCliente(id);
      res.json({
        success: true,
        data: cliente
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({ 
        success: false,
        error: error.message 
      });
    }
  }

  async criarCliente(req: Request, res: Response) {
    try {
      const criarClienteDTO = await this.validateDto(CriarClienteDTO, req.body);
      const cliente = await this.clienteCRUDService.criarCliente(
        criarClienteDTO.nome,
        criarClienteDTO.email
      );
      res.status(201).json({
        success: true,
        data: cliente,
        message: 'Cliente criado com sucesso'
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({ 
        success: false,
        error: error.message 
      });
    }
  }

  async atualizarCliente(req: Request, res: Response) {
    try {
      const id = this.parseId(req.params.id);
      const atualizarClienteDTO = await this.validateDto(AtualizarClienteDTO, req.body);
      
      const cliente = await this.clienteCRUDService.atualizarCliente(
        id,
        atualizarClienteDTO.nome,
        atualizarClienteDTO.email
      );
      
      res.json({
        success: true,
        data: cliente,
        message: 'Cliente atualizado com sucesso'
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({ 
        success: false,
        error: error.message 
      });
    }
  }

  async excluirCliente(req: Request, res: Response) {
    try {
      const id = this.parseId(req.params.id);
      const resultado = await this.clienteCRUDService.excluirCliente(id);
      
      if (resultado) {
        res.status(204).send();
      } else {
        res.status(404).json({ 
          success: false,
          error: 'Cliente não encontrado' 
        });
      }
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({ 
        success: false,
        error: error.message 
      });
    }
  }

  async depositar(req: Request, res: Response) {
    try {
      const id = this.parseId(req.params.id);
      const operacaoDTO = await this.validateDto(OperacaoFinanceiraDTO, req.body);
      
      const cliente = await this.clienteOperacoesService.depositar(id, operacaoDTO.valor);
      
      res.json({
        success: true,
        data: cliente,
        message: `Depósito de R$ ${operacaoDTO.valor.toFixed(2)} realizado com sucesso`
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({ 
        success: false,
        error: error.message 
      });
    }
  }

  async sacar(req: Request, res: Response) {
    try {
      const id = this.parseId(req.params.id);
      const operacaoDTO = await this.validateDto(OperacaoFinanceiraDTO, req.body);
      
      const cliente = await this.clienteOperacoesService.sacar(id, operacaoDTO.valor);
      
      res.json({
        success: true,
        data: cliente,
        message: `Saque de R$ ${operacaoDTO.valor.toFixed(2)} realizado com sucesso`
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({ 
        success: false,
        error: error.message 
      });
    }
  }

  async obterSaldo(req: Request, res: Response) {
    try {
      const id = this.parseId(req.params.id);
      const saldo = await this.clienteOperacoesService.obterSaldo(id);
      
      res.json({
        success: true,
        data: { saldo },
        message: `Saldo atual: R$ ${saldo.toFixed(2)}`
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({ 
        success: false,
        error: error.message 
      });
    }
  }

  async transferir(req: Request, res: Response) {
    try {
      const idOrigem = this.parseId(req.params.idOrigem);
      const idDestino = this.parseId(req.params.idDestino);
      const operacaoDTO = await this.validateDto(OperacaoFinanceiraDTO, req.body);
      
      const resultado = await this.clienteOperacoesService.transferir(
        idOrigem, 
        idDestino, 
        operacaoDTO.valor
      );
      
      res.json({
        success: true,
        data: resultado,
        message: `Transferência de R$ ${operacaoDTO.valor.toFixed(2)} realizada com sucesso`
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({ 
        success: false,
        error: error.message 
      });
    }
  }
}