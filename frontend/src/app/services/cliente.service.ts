import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente, Transferencia } from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  getClientes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/clientes`);
  }

  criarCliente(cliente: Omit<Cliente, 'id'>): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/clientes`, cliente);
  }

  atualizarCliente(id: number, cliente: Partial<Cliente>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/clientes/${id}`, cliente);
  }

  excluirCliente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clientes/${id}`);
  }

  depositar(id: number, valor: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/clientes/${id}/depositar`, { valor });
  }

  sacar(id: number, valor: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/clientes/${id}/sacar`, { valor });
  }

  transferir(transferencia: Transferencia): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/clientes/${transferencia.idOrigem}/transferir/${transferencia.idDestino}`, 
      { valor: transferencia.valor }
    );
  }

  getSaldo(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/clientes/${id}/saldo`);
  }
}