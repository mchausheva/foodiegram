import { Request, Response } from 'express';
import { Recipe } from '../models/recipe';
import { RecipeModel } from '../db/models/Recipe';
import { UserModel } from '../db/models/User';

// All recipe operations now backed by MongoDB via RecipeModel

// GET WITH OPTIONAL FILTERS BY CATEGORY & DIFFICULTY
export const getAllRecipes = async (req: Request, res: Response) => {
  const { category, difficulty, q, sort } = req.query as Record<string, string | undefined>;
  const page = Math.max(parseInt((req.query.page as string) || '1', 10), 1);
  const requestedLimit = parseInt((req.query.limit as string) || '10', 10);
  const limit = Math.min(Math.max(isNaN(requestedLimit) ? 10 : requestedLimit, 1), 10);
  const reqAny = req as any;

  const filter: any = {};
  if (reqAny.userRole !== 'admin') {
    filter.$or = [
      { status: { $exists: false } },
      { status: 'approved' },
      ...(reqAny.userId ? [{ 'author.id': reqAny.userId }] : []),
    ];
  }
  if ((req.query as any).savedOnly === 'true') {
    if (!reqAny.userId) return res.json([]);
    filter.savedBy = { $in: [reqAny.userId] };
  }
  if (category) {
    const cats = category.split(',');
    filter.category = { $in: cats };
  }
  if (difficulty) {
    const diffs = difficulty.split(',');
    filter.difficulty = { $in: diffs };
  }
  if (q) {
    filter.title = { $regex: q, $options: 'i' };
  }

  let query = RecipeModel.find(filter).lean();
  if (sort === 'new') query = query.sort({ createdAt: -1 });
  else if (sort === 'old') query = query.sort({ createdAt: 1 });
  else if (sort === 'rating') query = query.sort({ rating: -1 });

  const [results, total] = await Promise.all([
    query.skip((page - 1) * limit).limit(limit).exec(),
    RecipeModel.countDocuments(filter)
  ]);
  res.json({ recipes: results, total, page, limit, totalPages: Math.ceil(total / limit) });
};

// GET BY ID
export const getRecipeById = async (req: Request, res: Response) => {
  const reqAny = req as any;
  const recipe = (await RecipeModel.findOne({ id: req.params.id }).lean()) as any;
  if (!recipe) {
    return res.status(404).json({ message: 'Recipe not found' });
  }
  // Visibility: admin or owner can view any; others only approved (or no status)
  if (recipe.status && recipe.status !== 'approved') {
    const isAdmin = reqAny.userRole === 'admin';
    const isOwner = reqAny.userId && recipe.author.id === reqAny.userId;
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'Recipe not available' });
    }
  }
  res.json(recipe);
};

// GET USER RECIPES
export const getUserRecipes = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const mine = await RecipeModel.find({ 'author.id': userId }).lean();
  res.json(mine);
};

// CREATE
export const createRecipe = async (req: Request, res: Response) => {
  if ((req as any).userGuest) return res.status(403).json({ message: 'Guests cannot create recipes' });
  const user = await UserModel.findById((req as any).userId).lean();
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const {
      title,
      description,
      ingredients,
      steps,
      tags,
      cookingTime,
      servings,
      difficulty,
      category,
      nutrition
    } = req.body;

    const newRecipe: Recipe = {
      id: Date.now().toString(),
      title,
      description,
      image: (req as any).file ? `/uploads/${(req as any).file.filename}` : '',
      author: {
        id: String(user._id),
        name: user.username,
        avatar: user.avatar || '/avatars/default.png'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ingredients: JSON.parse(ingredients),
      steps: JSON.parse(steps),
      tags: JSON.parse(tags),
      cookingTime: Number(cookingTime),
      servings: Number(servings),
      difficulty,
      category: (() => {
        try {
          const parsed = JSON.parse(category);
          if (Array.isArray(parsed)) return parsed.map((c:string)=>c.trim());
        } catch (_) {
          if (typeof category === 'string') {
            return category.split(',').map(c => c.trim());
          }
        }
        return [] as string[];
      })(),
      nutrition: JSON.parse(nutrition),
      rating: 0,
      reviewCount: 0,
      likedBy: [],
      savedBy: [],
      likes: 0,
      comments: [],
      status: 'pending'
    };

    await RecipeModel.create(newRecipe as any);
    res.status(201).json(newRecipe);
  } catch (err) {
    console.error('Error creating recipe:', err);
    res.status(400).json({ message: 'Invalid recipe data' });
  }
};


// UPDATE
export const updateRecipe = async (req: Request, res: Response) => {
  const recipe = await RecipeModel.findOne({ id: req.params.id });
  if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

  // Ownership enforcement
  const userId = (req as any).userId;
  if ((req as any).userGuest) return res.status(403).json({ message: 'Guests cannot update recipes' });
  if (!userId || !recipe.author || (recipe.author as any).id !== userId) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const {
    title, description, ingredients, steps, tags, cookingTime,
    servings, difficulty, category, nutrition
  } = req.body;

  // Save edits into a draft and mark pending; keep the published version intact
  const nextDraft: any = { };
  if (title) nextDraft.title = title;
  if (description) nextDraft.description = description;
  if (req.file) nextDraft.image = `/uploads/${req.file.filename}`;
  else if (typeof (req.body as any).image === 'string' && (req.body as any).image.trim().length > 0) nextDraft.image = (req.body as any).image.trim();
  if (ingredients) nextDraft.ingredients = JSON.parse(ingredients);
  if (steps) nextDraft.steps = JSON.parse(steps);
  if (tags) nextDraft.tags = JSON.parse(tags);
  if (cookingTime) nextDraft.cookingTime = Number(cookingTime);
  if (servings) nextDraft.servings = Number(servings);
  if (difficulty) nextDraft.difficulty = difficulty;
  if (category) {
    try {
      const parsed = JSON.parse(category);
      if (Array.isArray(parsed)) nextDraft.category = parsed.map((c:string)=>c.trim());
    } catch {
      if (typeof category === 'string') nextDraft.category = category.split(',').map(c => c.trim());
    }
  }
  if (nutrition) nextDraft.nutrition = JSON.parse(nutrition);

  (recipe as any).draft = nextDraft;
  (recipe as any).status = 'pending';
  (recipe as any).declineReason = undefined;
  (recipe as any).updatedAt = new Date().toISOString();

  await recipe.save();
  res.json(recipe.toObject());
};

// DELETE
export const deleteRecipe = async (req: Request, res: Response) => {
  const indexRecipe = await RecipeModel.findOne({ id: req.params.id });
  if (!indexRecipe) return res.status(404).json({ message: 'Recipe not found' });

  // Ownership enforcement
  const userId = (req as any).userId;
  if ((req as any).userGuest) return res.status(403).json({ message: 'Guests cannot delete recipes' });
  if (!userId || (indexRecipe as any).author.id !== userId) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  await indexRecipe.deleteOne();
  res.json({ message: 'Recipe deleted' });
};

// TOGGEL SAVE
export const toggleSave = async (req: Request, res: Response) => {
  const recipe = await RecipeModel.findOne({ id: req.params.id });
  const userId = (req as any).userId;

  if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  if ((req as any).userGuest) return res.status(403).json({ message: 'Guests cannot save recipes' });

  if (!recipe.savedBy) recipe.savedBy = [];

  if ((recipe.savedBy as any[]).includes(userId)) {
    recipe.savedBy = (recipe.savedBy as string[]).filter((id: string) => id !== userId) as any;
  } else {
    (recipe.savedBy as any[]).push(userId);
  }

  await recipe.save();
  res.json(recipe.toObject());
};

// TOGGLE LIKE
export const toggleLike = async (req: Request, res: Response) => {
  const recipe = await RecipeModel.findOne({ id: req.params.id });
  if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

  const userId =(req as any).userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  if ((req as any).userGuest) return res.status(403).json({ message: 'Guests cannot like recipes' });

  if (!recipe.likedBy) recipe.likedBy = [];

  if ((recipe.likedBy as any[]).includes(userId)) {
    recipe.likedBy = (recipe.likedBy as string[]).filter((id: string) => id !== userId) as any;
    recipe.likes = Math.max((recipe.likes || 1) - 1, 0);
  } else {
    (recipe.likedBy as any[]).push(userId);
    recipe.likes = (recipe.likes || 0) + 1;
  }

  // 🔢 Re-calculate rating based on likes. Simple formula: 20 likes = 1 star, cap at 5.
  const newRating = Math.min(recipe.likes / 20, 5);
  recipe.rating = Math.round(newRating * 10) / 10; // one decimal place

  await recipe.save();
  res.json(recipe.toObject());
};

// ADD COMMENT
export const addComment = async (req: Request, res: Response) => {
  const recipe = await RecipeModel.findOne({ id: req.params.id });
  const userId = (req as any).userId;
  const { text, anonymous } = req.body as { text?: string; anonymous?: boolean };

  if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  if ((req as any).userGuest) return res.status(403).json({ message: 'Guests cannot comment' });
  if (!text || typeof text !== 'string') return res.status(400).json({ message: 'Comment text is required' });

  const author = await UserModel.findById(userId).lean();
  const newComment = {
    id: Date.now().toString(),
    user: anonymous ? 'Anonymous' : (author?.username || userId),
    text,
    createdAt: new Date().toISOString()
  };

  recipe.comments = [...(recipe.comments || []), newComment] as any;
  await recipe.save();
  res.status(201).json(newComment);
};

// ADMIN: Update recipe status (approved/declined)
export const updateRecipeStatusAdmin = async (req: Request, res: Response) => {
  const recipe = await RecipeModel.findOne({ id: req.params.id });
  if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

  const { status, reason, category: categoryRaw } = req.body as { status?: 'approved' | 'declined'; reason?: string; category?: string | string[] };
  if (status !== 'approved' && status !== 'declined') {
    return res.status(400).json({ message: 'Status must be approved or declined' });
  }

  if (status === 'approved') {
    // If there is a draft, publish it into the main fields
    if ((recipe as any).draft) {
      const d:any = (recipe as any).draft;
      Object.assign(recipe as any, d);
      (recipe as any).draft = undefined;
    }
    // Optional: admin may update categories during review
    if (typeof categoryRaw !== 'undefined') {
      try {
        if (typeof categoryRaw === 'string') {
          // try JSON first, then comma-separated
          try {
            const parsed = JSON.parse(categoryRaw);
            if (Array.isArray(parsed)) (recipe as any).category = parsed.map((c:string)=>c.trim());
            else (recipe as any).category = String(categoryRaw).split(',').map(c=>c.trim());
          } catch {
            (recipe as any).category = String(categoryRaw).split(',').map(c=>c.trim());
          }
        } else if (Array.isArray(categoryRaw)) {
          (recipe as any).category = (categoryRaw as string[]).map(c=>String(c).trim());
        }
      } catch {}
    }
    (recipe as any).declineReason = undefined;
  } else {
    (recipe as any).declineReason = reason || '';
  }
  (recipe as any).status = status;
  (recipe as any).updatedAt = new Date().toISOString();
  await recipe.save();
  return res.json(recipe.toObject());
};
