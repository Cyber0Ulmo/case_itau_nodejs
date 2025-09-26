export class Cliente {
  constructor(
    public id: number,
    public nome: string,
    public email: string,
    public saldo: number
  ) {}

  depositar(valor: number): void {
    if (valor <= 0) {
      throw new Error('Valor de depósito deve ser positivo');
    }
    this.saldo += valor;
  }

  sacar(valor: number): void {
    if (valor <= 0) {
      throw new Error('Valor de saque deve ser positivo');
    }
    if (valor > this.saldo) {
      throw new Error('Saldo insuficiente');
    }
    this.saldo -= valor;
  }

  validarEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }
}