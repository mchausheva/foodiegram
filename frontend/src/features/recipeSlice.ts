// src/features/recipeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
}

interface RecipeState {
  recipes: Recipe[];
  savedRecipes: Recipe[];
  myRecipes: Recipe[];
}

const initialState: RecipeState = {
  recipes: [],
  savedRecipes: [],
  myRecipes: [],
};

const recipeSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    setRecipes(state, action: PayloadAction<Recipe[]>) {
      state.recipes = action.payload;
    },
    addSavedRecipe(state, action: PayloadAction<Recipe>) {
      if (!state.savedRecipes.find(r => r.id === action.payload.id)) {
        state.savedRecipes.push(action.payload);
      }
    },
    removeSavedRecipe(state, action: PayloadAction<string>) {
      state.savedRecipes = state.savedRecipes.filter(r => r.id !== action.payload);
    },
    // My Recipes CRUD actions
    addMyRecipe(state, action: PayloadAction<Recipe>) {
      state.myRecipes.push(action.payload);
    },
    editMyRecipe(state, action: PayloadAction<Recipe>) {
      state.myRecipes = state.myRecipes.map(r => 
        r.id === action.payload.id ? action.payload : r
      );
    },
    deleteMyRecipe(state, action: PayloadAction<string>) {
      state.myRecipes = state.myRecipes.filter(r => r.id !== action.payload);
    },
  },
});

export const {
  setRecipes, addSavedRecipe, removeSavedRecipe,
  addMyRecipe, editMyRecipe, deleteMyRecipe
} = recipeSlice.actions;

export default recipeSlice.reducer;
