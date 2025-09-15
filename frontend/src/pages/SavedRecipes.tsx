// src/pages/SavedRecipes.tsx
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import RecipeCard from '../components/RecipeCard';
import { RootState } from '../features/store';
import Validator from './Validator';
import { useEffect } from 'react';
import api from '../services/api';
import { setSavedRecipes } from '../features/recipeSlice';

function SavedRecipes() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const savedRecipes = useSelector((state: RootState) => state.recipes.savedRecipes);
  const isGuest = !!user?.guest;

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        const { data } = await api.get('/recipes', { params: { savedOnly: true, page: 1, limit: 10 } });
        dispatch(setSavedRecipes(data.recipes || data || []));
      } catch {}
    };
    load();
  }, [user, dispatch]);

  // Extra safety: filter by the current user in case stale items are present
  const userSaved = (savedRecipes || []).filter(r => (r.savedBy || []).includes(user?.id || ''))
    // de-duplicate by id
    .filter((r, idx, arr) => arr.findIndex(x => x.id === r.id) === idx);

  return (
    <Container style={{ opacity: isGuest ? 0.5 : 1 }}>
      <h2 className="text-center my-4">❤️ My Saved Recipes</h2>
         {!user ? (
        <Validator/>
      ) : (
        <>
      {isGuest && (
        <Alert variant="info" className="text-center">You are browsing as Guest. Log in/register to manage saved recipes.</Alert>
      )}
      {userSaved.length === 0 ? (
        <p className="text-center">You haven't saved any recipes yet.</p>
      ) : (
        <Row>
          {userSaved.map((recipe) => (
            <Col key={recipe.id} sm={12} md={6} lg={4} xl={3}>
              <RecipeCard recipe={recipe} />
            </Col>
          ))}
        </Row>
      )}
      </>
      )}
    </Container>
  );
}

export default SavedRecipes;
