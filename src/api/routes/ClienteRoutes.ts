import { Router } from 'express';
import { ClienteController } from '../controllers/ClienteController.js';

export default function createClienteRoutes(clienteController: ClienteController): Router {
  const router = Router();

  router.get('/clientes', (req, res) => clienteController.listarClientes(req, res));
  router.get('/clientes/:id', (req, res) => clienteController.obterCliente(req, res));
  router.post('/clientes', (req, res) => clienteController.criarCliente(req, res));
  router.put('/clientes/:id', (req, res) => clienteController.atualizarCliente(req, res));
  router.delete('/clientes/:id', (req, res) => clienteController.excluirCliente(req, res));

  router.post('/clientes/:id/depositar', (req, res) => clienteController.depositar(req, res));
  router.post('/clientes/:id/sacar', (req, res) => clienteController.sacar(req, res));
  router.get('/clientes/:id/saldo', (req, res) => clienteController.obterSaldo(req, res));
  router.post('/clientes/:idOrigem/transferir/:idDestino', (req, res) => clienteController.transferir(req, res));

  //Health Check
  router.get('/health', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'API está funcionando corretamente',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  });

  return router;
}