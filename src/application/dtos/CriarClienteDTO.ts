import { IsEmail, IsString, MinLength } from 'class-validator';

export class CriarClienteDTO {
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(3, { message: 'Nome deve ter pelo menos 3 caracteres' })
  nome!: string;

  @IsEmail({}, { message: 'Email deve ser um endereço válido' })
  email!: string;
}