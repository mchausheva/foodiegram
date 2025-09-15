// Enums for better type safety
export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard'
}

export enum Category {
  SEAFOOD = 'Seafood',
  ITALIAN = 'Italian',
  SALADS = 'Salads',
  PASTA = 'Pasta',
  PIZZA = 'Pizza',
  APPETIZERS = 'Appetizers',
  DESSERTS = 'Desserts',
  BREAKFAST = 'Breakfast',
  LUNCH = 'Lunch',
  DINNER = 'Dinner',
  VEGETARIAN = 'Vegetarian',
  BRUNCH = 'Brunch',
  DESSERT = 'Dessert'
}

export enum Unit {
  PIECES = 'pieces',
  GRAMS = 'grams',
  TABLESPOONS = 'tablespoons',
  TEASPOON = 'teaspoon',
  CUPS = 'cups',
  OUNCES = 'ounces',
  POUNDS = 'pounds',
  MILLILITERS = 'milliliters',
  LITERS = 'liters',
  CLOVES = 'cloves',
  LEAVES = 'leaves',
  BALL = 'ball'
}

// Author interface
export interface Author {
  id: number;
  name: string;
  avatar?: string;
  bio?: string;
  socialMedia?: {
    instagram?: string;
    twitter?: string;
    website?: string;
  };
  joinedAt?: string; // ISO string
  location?: string; // City or country
}

// Ingredient interface
export interface Ingredient {
  name: string;
  quantity: number;
  unit: Unit | string;
  notes?: string;
  optional?: boolean;
}

// Cooking step interface
export interface Step {
  stepNumber: number;
  instruction: string;
  duration: number; // in minutes
  image?: string;
  tips?: string;
}

// Nutrition information interface
export interface Nutrition {
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fat: number; // in grams
  fiber: number; // in grams
  sugar?: number; // in grams
  sodium?: number; // in mg
}

// Comments infomation interface
export interface Comment {
  id: string;
  user: string;
  text: string;
  createdAt: string;
}

// Main Recipe interface
export interface Recipe {
  id: string; // UUID or string ID
  title: string;
  description: string;
  image: string;
  author: Author;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  cookingTime: number; // in minutes
  prepTime?: number; // in minutes
  servings: number;
  difficulty: Difficulty;
  category: Category[];
  ingredients: Ingredient[];
  steps: Step[];
  tags: string[];
  nutrition: Nutrition;
  rating: number; // 0-5 scale
  reviewCount: number;
  isBookmarked?: boolean;
  isPublic?: boolean;
  views?: number;
  savedBy?: string[];
  likes?: number;
  likedBy?: string[];
  comments?: Comment[];
  status?: 'pending' | 'approved' | 'declined';
  declineReason?: string;
}

// Recipe creation/update DTOs
export interface CreateRecipeDTO {
  title: string;
  description: string;
  image?: string;
  cookingTime: number;
  prepTime?: number;
  servings: number;
  difficulty: Difficulty;
  category: Category[];
  ingredients: Omit<Ingredient, 'id'>[];
  steps: Omit<Step, 'id'>[];
  tags: string[];
  nutrition?: Nutrition;
  isPublic?: boolean;
}

export interface UpdateRecipeDTO extends Partial<CreateRecipeDTO> {
  id: number;
}

// Recipe filter/search interfaces
export interface RecipeFilters {
  category?: Category;
  difficulty?: Difficulty;
  maxCookingTime?: number;
  tags?: string[];
  rating?: number;
  author?: number;
}

export interface RecipeSearchParams {
  query?: string;
  filters?: RecipeFilters;
  sortBy?: 'rating' | 'createdAt' | 'cookingTime' | 'title';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// API Response interfaces
export interface RecipeResponse {
  recipe: Recipe;
  message?: string;
}

export interface RecipesResponse {
  recipes: Recipe[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Review/Rating interfaces
export interface Review {
  id: number;
  recipeId: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  helpful?: number;
}

export interface CreateReviewDTO {
  recipeId: number;
  rating: number;
  comment: string;
}

// Utility types for partial updates
export type RecipePreview = Pick<Recipe, 
  'id' | 'title' | 'description' | 'image' | 'author' | 'cookingTime' | 
  'servings' | 'difficulty' | 'rating' | 'reviewCount' | 'tags'
>;

export type RecipeCard = Pick<Recipe,
  'id' | 'title' | 'image' | 'cookingTime' | 'servings' | 'difficulty' | 'rating'
>;

// Form validation schemas (can be used with libraries like Yup or Zod)
export interface RecipeFormData {
  title: string;
  description: string;
  cookingTime: string;
  prepTime?: string;
  servings: string;
  difficulty: Difficulty;
  category: Category[];
  ingredients: {
    name: string;
    quantity: string;
    unit: string;
    notes?: string;
  }[];
  steps: {
    instruction: string;
    duration: string;
    tips?: string;
  }[];
  tags: string;
  isPublic: boolean;
} 