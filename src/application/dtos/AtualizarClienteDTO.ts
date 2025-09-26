import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class AtualizarClienteDTO {
  @IsOptional()
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(3, { message: 'Nome deve ter pelo menos 3 caracteres' })
  nome?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email deve ser um endereço válido' })
  email?: string;
}