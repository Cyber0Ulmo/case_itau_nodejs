import express, { Request, Response, NextFunction } from 'express';
import db from './infrastructure/database/database.js';
import { ClienteRepository } from './infrastructure/repositories/ClienteRepository.js';
import { ClienteCRUDService } from './application/services/ClienteCRUDService.js';
import { ClienteOperacoesService } from './application/services/ClienteOperacoesService.js';
import { ClienteController } from './api/controllers/ClienteController.js';
import { securityMiddleware, loggingMiddleware } from './api/middlewares/SecurityMiddleware.js';
import createClienteRoutes from './api/routes/ClienteRoutes.js';

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ MIDDLEWARES PRINCIPAIS PRIMEIRO
app.use(express.json());
app.use(loggingMiddleware);
app.use(securityMiddleware);

// ✅ AGORA OS MIDDLEWARES DE LOGS DE SEGURANÇA
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'POST' && (
      req.path.includes('/depositar') || 
      req.path.includes('/sacar') ||
      req.path.includes('/transferir')
  )) {
    console.log(`💰 OPERAÇÃO FINANCEIRA - ${new Date().toISOString()}`);
    console.log(`   IP: ${req.ip}`);
    console.log(`   Método: ${req.method} ${req.path}`);
    console.log(`   Body: ${JSON.stringify(req.body)}`);
    console.log(`   Params: ${JSON.stringify(req.params)}`);
    console.log('   ---');
  }
  next();
});

app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'DELETE' || 
      (req.method === 'POST' && req.path === '/api/clientes') ||
      (req.method === 'PUT' && req.path.includes('/clientes/'))) {
    console.log(`🔐 OPERAÇÃO SENSÍVEL - ${new Date().toISOString()}`);
    console.log(`   IP: ${req.ip}`);
    console.log(`   Método: ${req.method} ${req.path}`);
    console.log(`   User-Agent: ${req.get('User-Agent')}`);
    console.log('   ---');
  }
  next();
});

// ✅ DEPOIS CONFIGURAMOS AS ROTAS
const clienteRepository = new ClienteRepository(db);
const clienteCRUDService = new ClienteCRUDService(clienteRepository);
const clienteOperacoesService = new ClienteOperacoesService(clienteRepository);
const clienteController = new ClienteController(clienteCRUDService, clienteOperacoesService);

app.use('/api', createClienteRoutes(clienteController));

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log('🔒 Logs de segurança ativados');
});