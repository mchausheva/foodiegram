import { Router } from 'express';
import { addComment, createRecipe, deleteRecipe, getAllRecipes, getRecipeById, getUserRecipes, toggleLike, toggleSave, updateRecipe, updateRecipeStatusAdmin } from '../controllers/recipeController';
import { protect, requireAdmin } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';
import { CategoryModel } from '../db/models/Category';

const router = Router();

router.get('/', protect, getAllRecipes);
// Place more specific routes before parameterized routes to avoid conflicts
router.get('/mine', protect, getUserRecipes);

// Categories admin and list – must be before parameterized `/:id` route
router.get('/categories', async (_req, res) => {
  const list = await CategoryModel.find({}).lean();
  res.json(list.map(c => c.name));
});
router.post('/categories', protect, requireAdmin, async (req, res) => {
  const { name } = req.body as { name?: string };
  if (!name) return res.status(400).json({ message: 'Name required' });
  await CategoryModel.updateOne({ name }, { name }, { upsert: true });
  res.status(201).json({ ok: true });
});
router.put('/categories/:name', protect, requireAdmin, async (req, res) => {
  const { name } = req.body as { name?: string };
  if (!name) return res.status(400).json({ message: 'Name required' });
  const updated = await CategoryModel.findOneAndUpdate({ name: req.params.name }, { name }, { new: true });
  if (!updated) return res.status(404).json({ message: 'Category not found' });
  res.json({ ok: true });
});
router.delete('/categories/:name', protect, requireAdmin, async (req, res) => {
  const deleted = await CategoryModel.findOneAndDelete({ name: req.params.name });
  if (!deleted) return res.status(404).json({ message: 'Category not found' });
  res.json({ ok: true });
});

router.get('/:id', protect, getRecipeById);

router.post('/', protect, upload.single('image'),  createRecipe);
router.put('/:id', protect, updateRecipe);
router.delete('/:id', protect, deleteRecipe);

router.put('/:id/like', protect, toggleLike);
router.put('/:id/save', protect, toggleSave);
router.post('/:id/comments', protect, addComment);

// Admin-only endpoints will be placed under the same resource with extra guard
// Update recipe status (approve/decline)
// Expected body: { status: 'approved' | 'declined', reason?: string }
router.put('/:id/status', protect, requireAdmin, updateRecipeStatusAdmin);


export default router;
