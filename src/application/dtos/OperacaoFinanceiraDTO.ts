import { IsNumber, Min } from 'class-validator';

export class OperacaoFinanceiraDTO {
  @IsNumber({}, { message: 'Valor deve ser um número' })
  @Min(0.01, { message: 'Valor deve ser maior que zero' })
  valor!: number;
}