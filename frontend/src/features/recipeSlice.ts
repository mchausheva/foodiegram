// src/features/recipeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Comment, Recipe } from '../types/recipe.types';

interface RecipeState {
  recipes: Recipe[];
  savedRecipes: Recipe[];
  myRecipes: Recipe[];
  currentRecipe: Recipe | null;
}

const initialState: RecipeState = {
  recipes: [],
  savedRecipes: [],
  myRecipes: [],
  currentRecipe: null
};

const recipeSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    setCurrentRecipe(state, action: PayloadAction<Recipe>) {
      state.currentRecipe = action.payload;
    },
    setRecipes(state, action: PayloadAction<Recipe[]>) {
      state.recipes = action.payload;
    },
    setSavedRecipes(state, action: PayloadAction<Recipe[]>) {
      state.savedRecipes = action.payload;
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
    setMyRecipes(state, action: PayloadAction<Recipe[]>) {
      state.myRecipes = action.payload;
    },
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
    addCommentToCurrentRecipe(state, action: PayloadAction<Comment>) {
      if (state.currentRecipe) {
        state.currentRecipe.comments = [
          ...(state.currentRecipe.comments || []),
          action.payload
        ];
      }
    }
  },
});

export const {
  setCurrentRecipe,
  setRecipes, setSavedRecipes, addSavedRecipe, removeSavedRecipe,
  addMyRecipe, editMyRecipe, deleteMyRecipe,
  addCommentToCurrentRecipe, setMyRecipes
} = recipeSlice.actions;

export default recipeSlice.reducer;
