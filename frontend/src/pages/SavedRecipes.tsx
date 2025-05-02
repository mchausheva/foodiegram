// src/pages/SavedRecipes.tsx
import { useSelector } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import RecipeCard from '../components/RecipeCard';
import { RootState } from '../features/store';

function SavedRecipes() {
  const savedRecipes = useSelector((state: RootState) => state.recipes.savedRecipes);

  return (
    <Container>
      <h2 className="text-center my-4">❤️ My Saved Recipes</h2>
      {savedRecipes.length === 0 ? (
        <p className="text-center">You haven't saved any recipes yet.</p>
      ) : (
        <Row>
          {savedRecipes.map((recipe) => (
            <Col key={recipe.id} sm={12} md={6} lg={4} xl={3}>
              <RecipeCard recipe={recipe} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default SavedRecipes;
