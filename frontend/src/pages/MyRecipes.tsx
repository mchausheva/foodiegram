// src/pages/MyRecipes.tsx
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { RootState } from '../features/store';
import RecipeCard from '../components/RecipeCard';
import { Link } from 'react-router-dom';

function MyRecipes() {
  const myRecipes = useSelector((state: RootState) => state.recipes.myRecipes);

  return (
    <Container>
      <h2 className="text-center my-4">👩‍🍳 My Recipes</h2>
      <div className="text-center mb-4">
        <Link to="/my-recipes/add">
          <Button variant="success">+ Add New Recipe</Button>
        </Link>
      </div>

      {myRecipes.length === 0 ? (
        <p className="text-center">You haven't created any recipes yet.</p>
      ) : (
        <Row>
          {myRecipes.map(recipe => (
            <Col key={recipe.id} sm={12} md={6} lg={4}>
              <RecipeCard recipe={recipe} isEditable />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default MyRecipes;
