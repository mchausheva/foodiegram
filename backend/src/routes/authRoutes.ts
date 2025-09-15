import { Router } from 'express';
import { signup, login, getProfile, updateProfile, guestLogin } from '../controllers/authController';
import { protect, requireAdmin } from '../middleware/authMiddleware';
import { BannedEmailModel } from '../db/models/BannedEmail';
import { UserModel } from '../db/models/User';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/guest', guestLogin);
router.get('/me', protect, getProfile);
router.put('/me', protect, updateProfile);

// Admin: deactivate/reactivate users (Mongo)
router.get('/users', protect, requireAdmin, async (_req, res) => {
  const list = await UserModel.find({}).lean();
  res.json(list);
});
router.put('/users/:id/toggle-active', protect, requireAdmin, async (req, res) => {
  const user = await UserModel.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.active = !user.active;
  await user.save();
  return res.json(user.toObject());
});

// Admin: manage banned emails
router.get('/banned-emails', protect, requireAdmin, async (_req, res) => {
  const list = await BannedEmailModel.find({}).lean();
  res.json(list.map(b => b.email));
});
router.post('/banned-emails', protect, requireAdmin, async (req, res) => {
  const { email } = req.body as { email?: string };
  if (!email) return res.status(400).json({ message: 'Email required' });
  await BannedEmailModel.updateOne({ email }, { email }, { upsert: true });
  res.status(201).json({ ok: true });
});
router.delete('/banned-emails', protect, requireAdmin, async (req, res) => {
  const { email } = req.body as { email?: string };
  if (!email) return res.status(400).json({ message: 'Email required' });
  await BannedEmailModel.deleteOne({ email });
  res.json({ ok: true });
});

export default router;
