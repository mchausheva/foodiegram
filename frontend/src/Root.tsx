// src/Root.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import MyRecipes from './pages/MyRecipes';
import AddRecipe from './pages/AddRecipe';
import EditRecipe from './pages/EditRecipe';
import SavedRecipes from './pages/SavedRecipes';
import Profile from './pages/Profile';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'recipes', element: <Recipes /> },
      { path: 'recipes/:id', element: <RecipeDetail /> },
      { path: 'my-recipes', element: <MyRecipes /> },
      { path: 'my-recipes/add', element: <AddRecipe /> },
      { path: 'my-recipes/edit/:id', element: <EditRecipe /> },
      { path: 'saved-recipes', element: <SavedRecipes /> },
      { path: 'profile', element: <Profile /> },
    ],
  },
]);

const Root = () => <RouterProvider router={router} />;
export default Root;
