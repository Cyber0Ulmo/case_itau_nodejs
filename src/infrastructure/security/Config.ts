export const securityConfig = {
  // Configurações de JWT (para futura implementação)
  jwtSecret: process.env.JWT_SECRET || 'secret-dev',
  jwtExpiresIn: '24h',
  
  // Configurações de CORS
  corsOptions: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://seusite.com'] 
      : ['http://localhost:3000', 'http://localhost:4200'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  },
  
  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // limite de 100 requests por IP
  }
};