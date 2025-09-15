import dotenv from 'dotenv';
import { connectDb } from './config/db';
import app from './app';

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to connect DB', err);
  process.exit(1);
});
