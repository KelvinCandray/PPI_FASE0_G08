const express = require('express');
const session = require('express-session');
const { createClient } = require('redis');
const RedisStore = require('connect-redis').default;

const app = express();

// 1. Cliente de Redis (Debe apuntar a 'redis', NO a 'localhost')
const redisClient = createClient({
  url: 'redis://redis:6379'
});

redisClient.on('error', (err) => console.error('Error en Redis Client:', err));

// Conectar a Redis
(async () => {
  await redisClient.connect();
  console.log('Conectado exitosamente a Redis');
})();

// 2. Middleware de Sesión centralizada en Redis
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: 'clave_secreta_poc08',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 86400000 }
}));

// 3. Endpoint de la API
app.get('/api/v1/info', (req, res) => {
  if (!req.session.views) {
    req.session.views = 1;
  } else {
    req.session.views++;
  }

  res.json({
    node: process.env.NODE_NAME || 'Nodo-01',
    ip: process.env.NODE_IP || '127.0.0.1',
    views: req.session.views,
    sessionId: req.sessionID
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend escuchando en puerto ${PORT}`);
});