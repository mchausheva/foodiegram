import { Schema, model } from 'mongoose';

const IngredientSchema = new Schema({
  name: String,
  quantity: Number,
  unit: String,
  notes: String,
}, { _id: false });

const StepSchema = new Schema({
  stepNumber: Number,
  instruction: String,
  duration: Number,
}, { _id: false });

const CommentSchema = new Schema({
  id: String,
  user: String,
  text: String,
  createdAt: String,
}, { _id: false });

const RecipeSchema = new Schema({
  id: { type: String, index: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: String,
  author: {
    id: String,
    name: String,
    avatar: String,
  },
  createdAt: String,
  updatedAt: String,
  cookingTime: Number,
  servings: Number,
  difficulty: String,
  category: [String],
  ingredients: [IngredientSchema],
  steps: [StepSchema],
  tags: [String],
  nutrition: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number,
  },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  savedBy: [String],
  likes: { type: Number, default: 0 },
  likedBy: [String],
  comments: [CommentSchema],
  status: { type: String, enum: ['pending', 'approved', 'declined'], default: 'pending' },
  declineReason: String,
  draft: { type: Object },
}, { timestamps: true });

export const RecipeModel = model('Recipe', RecipeSchema);


