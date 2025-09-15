import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from './services/api';
import { loginSuccess } from './features/authSlice';
import { setSavedRecipes } from './features/recipeSlice';
import { RootState } from './features/store';
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
import EditProfile from './pages/EditProfile';
import Admin from './pages/Admin';

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
      { path: 'profile/edit', element: <EditProfile /> }
      ,{ path: 'admin', element: <Admin /> }
    ],
  },
]);

const Root = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      (async () => {
        try {
          const { data } = await api.get('/auth/me');
          dispatch(loginSuccess({ user: data, token }));
          // hydrate saved recipes for the authenticated user
          try {
            const { data: list } = await api.get('/recipes', { params: { savedOnly: true } as any });
            dispatch(setSavedRecipes(list.recipes || list || []));
          } catch {}
        } catch {
          // ignore; token may be invalid
        }
      })();
    }
  }, [dispatch, user]);

  return <RouterProvider router={router} />;
};
export default Root;
