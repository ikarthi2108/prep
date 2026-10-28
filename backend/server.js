import 'dotenv/config';
import connectDB from './config/db.js';
import app from './app.js';

try {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('Set JWT_SECRET to at least 32 random characters in .env');
  }
  await connectDB();
  const port = Number(process.env.PORT) || 5000;
  app.listen(port, () => console.log('API listening on http://localhost:' + port));
} catch (error) {
  console.error('Startup failed:', error.message);
  process.exit(1);
}
