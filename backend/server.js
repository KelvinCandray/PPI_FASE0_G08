const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const { createClient } = require('redis');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_NAME = process.env.NODE_NAME || 'Nodo-Desconocido';

// Configuración del cliente Redis
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://redis-server:6379'
});
redisClient.connect().catch(console.error);

app.use(express.json());

// Sesión compartida en Redis
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET || 'secreto_desarrollo',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, httpOnly: true, maxAge: 86400000 }
}));

// Endpoint de prueba que devuelve el nodo y maneja el contador de sesión
app.get('/api/v1/info', (req, res) => {
  if (!req.session.views) {
    req.session.views = 1;
  } else {
    req.session.views++;
  }

  res.json({
    node: NODE_NAME,
    views: req.session.views,
    sessionId: req.sessionID,
    environment: process.env.APP_ENV || 'intranet'
  });
});

app.listen(PORT, () => {
  console.log(`Servidor ${NODE_NAME} iniciado en puerto ${PORT}`);
});