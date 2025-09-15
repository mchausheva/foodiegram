import express from 'express';
import cors from 'cors';
import recipeRoutes from './routes/recipeRoutes';
import authRoutes from './routes/authRoutes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('public/uploads'));

app.get('/', (_req, res) => {
  res.send('Welcome to FoodieGram Backend 🍽️');
});

app.use('/api/recipes', recipeRoutes);
app.use('/api/auth', authRoutes);

export default app;


