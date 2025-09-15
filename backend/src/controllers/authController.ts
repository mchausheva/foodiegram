import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../db/models/User';
import { BannedEmailModel } from '../db/models/BannedEmail';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export const signup = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const banned = await BannedEmailModel.findOne({ email });
  if (banned) return res.status(403).json({ message: 'Email is banned' });
  const existing = await UserModel.findOne({ email });
  if (existing) return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser: any = {
    id: Date.now().toString(),
    username,
    email,
    password: hashedPassword,
    bio: '',
    location: '',
    joinedAt: new Date().toISOString(),
    avatar: '/avatars/default.png' // Default avatar matches frontend public assets
    , role: 'user', active: true
  };

  const created = await UserModel.create(newUser);
  const token = jwt.sign({ id: created.id, role: created.role }, JWT_SECRET, { expiresIn: '1d' });
  res.status(201).json({ user: { id: created.id, username: created.username, email: created.email, role: created.role }, token });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const banned = await BannedEmailModel.findOne({ email });
  if (banned) return res.status(403).json({ message: 'Email is banned' });
  const user = await UserModel.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid email or password' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ user: { id: user.id, username: user.username, email, role: user.role }, token });
};

export const guestLogin = async (_req: Request, res: Response) => {
  // Create a transient guest identity with a special flag and short-lived token
  const guestId = `guest-${Date.now()}`;
  const token = jwt.sign({ id: guestId, guest: true }, JWT_SECRET, { expiresIn: '2h' });
  res.json({ user: { id: guestId, username: 'Guest', email: 'guest@foodiegram', guest: true }, token });
};

export const getProfile = async (req: Request, res: Response) => {
  const reqAny = req as any;
  // Return guest profile without lookup if JWT carries guest flag
  if (reqAny.userGuest === true) {
    return res.json({ id: reqAny.userId, username: 'Guest', email: 'guest@foodiegram', guest: true });
  }
  const user = await UserModel.findById(reqAny.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json({ id: user.id, username: user.username, email: user.email, role: user.role, active: user.active });
};

export const updateProfile = async (req: Request, res: Response) => {
  const user = await UserModel.findById((req as any).userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const { username, email, bio, location } = req.body;
  user.username = username || user.username;
  user.email = email || user.email;
  user.bio = bio;
  user.location = location;

  await user.save();
  res.json({ id: user.id, username: user.username, email: user.email, bio: user.bio, location: user.location });
};