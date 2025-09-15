export interface Comment {
  id: string;
  user: string;
  text: string;
  createdAt: string;
}

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
}

export interface Step {
  stepNumber: number;
  instruction: string;
  duration?: number;
}

export interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface Author {
  id: string; // UUID or string ID
  name: string;
  avatar: string;
}

export interface Recipe {
  id: string; // UUID or string ID
  title: string;
  description: string;
  image: string;
  author: Author;
  createdAt: string;
  updatedAt: string;
  cookingTime: number;
  servings: number;
  difficulty: string;
  category: string[];
  ingredients: Ingredient[];
  steps: Step[];
  tags: string[];
  nutrition: Nutrition;
  rating: number;
  reviewCount: number;
  savedBy?: string[];
  likes?: number;
  likedBy?: string[];
  comments?: Comment[];
  status?: 'pending' | 'approved' | 'declined';
  declineReason?: string;
  draft?: Partial<Omit<Recipe,
    'id' | 'author' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount' | 'likes' | 'likedBy' | 'savedBy' | 'comments' | 'status' | 'declineReason' | 'draft'>>;
}
