import app from './app';
import { env } from './config/env';
import { prisma } from './config/database';

const PORT = env.PORT;

const server = app.listen(PORT, () => {
  console.log(`🚀 Finance 360 Backend running on http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await prisma.$disconnect();
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});
