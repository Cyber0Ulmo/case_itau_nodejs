import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../shared/errors/AppError.js';

export const validateClienteId = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id; 
  
  if (!id) {
    throw new AppError('ID é obrigatório', 400);
  }
  
  const parsedId = parseInt(id);
  if (isNaN(parsedId) || parsedId <= 0) {
    throw new AppError('ID do cliente deve ser um número positivo', 400);
  }
  
  next();
};

export const validateOperacaoFinanceira = (req: Request, res: Response, next: NextFunction) => {
  const { valor } = req.body;
  
  if (valor === undefined || valor === null) {
    throw new AppError('Valor é obrigatório', 400);
  }
  
  if (typeof valor !== 'number' || valor <= 0) {
    throw new AppError('Valor deve ser um número positivo', 400);
  }
  
  next();
};