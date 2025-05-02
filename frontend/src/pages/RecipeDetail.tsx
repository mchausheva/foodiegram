// src/pages/RecipeDetail.tsx
import { Container, Image, Card, Badge, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { GiKnifeFork, GiCookingPot, GiTomato } from 'react-icons/gi';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { addSavedRecipe, removeSavedRecipe } from '../features/recipeSlice';
import { RootState } from '../features/store';

// Mock data (clearly defined)
const mockRecipes = [
  {
    id: '1',
    title: 'Classic Spaghetti Carbonara',
    image: '/carbonara.jpg',
    description: 'A quick, classic pasta dish made with eggs, cheese, pancetta, and pepper.',
    ingredients: ['Spaghetti', 'Eggs', 'Pancetta', 'Parmesan', 'Pepper'],
    steps: [
      'Cook spaghetti until al dente.',
      'Fry pancetta until crisp.',
      'Beat eggs with parmesan cheese.',
      'Mix spaghetti with pancetta and remove from heat.',
      'Quickly mix in egg and cheese mixture.',
      'Serve immediately with extra cheese and pepper.'
    ],
  },
  // add more mock recipes here...
];

function RecipeDetail() {
  const { id } = useParams();
  const recipe = mockRecipes.find((recipe) => recipe.id === id);

  if (!recipe) return <Container><p>Recipe not found!</p></Container>;

  const dispatch = useDispatch();
  const savedRecipes = useSelector((state: RootState) => state.recipes.savedRecipes);
  
  const isSaved = savedRecipes.some((saved) => saved.id === recipe.id);
  const [saved, setSaved] = useState(isSaved);
  
  useEffect(() => {
    setSaved(isSaved);
  }, [isSaved]);
  
  const handleSaveToggle = () => {
    if (saved) {
      dispatch(removeSavedRecipe(recipe.id));
    } else {
      dispatch(addSavedRecipe(recipe));
    }
    setSaved(!saved);
  };

  return (
    <Container className="my-5">
      <Card className="shadow-lg border-0">
        <Image src={recipe.image} fluid rounded style={{ maxHeight: '400px', objectFit: 'cover' }}/>

        <div className="text-center my-4">
        <Button variant={saved ? "danger" : "success"} onClick={handleSaveToggle}>
          {saved ? 'Remove from Saved Recipes' : 'Save Recipe'}
        </Button>
      </div>

        <Card.Body>
          <Card.Title className="display-5 text-center mb-3">
            {recipe.title}
          </Card.Title>

          <Card.Text className="lead text-center mb-4">
            {recipe.description}
          </Card.Text>

          <hr className="my-4"/>

          <h4 className="mb-3 text-success d-flex align-items-center gap-2">
            <GiTomato /> Ingredients
          </h4>
          <ul className="list-group list-group-flush mb-4">
            {recipe.ingredients.map((item, idx) => (
              <li className="list-group-item d-flex align-items-center" key={idx}>
                <Badge bg="success" className="me-2">✔️</Badge> {item}
              </li>
            ))}
          </ul>

          <hr className="my-4"/>

          <h4 className="mb-3 text-primary d-flex align-items-center gap-2">
            <GiCookingPot /> Cooking Steps
          </h4>
          <ol className="list-group list-group-numbered list-group-flush">
            {recipe.steps.map((step, idx) => (
              <li className="list-group-item" key={idx}>{step}</li>
            ))}
          </ol>

          <div className="text-center mt-4">
            <Link className="btn btn-outline-primary" to="/recipes">
              <GiKnifeFork className="me-2"/> Back to Recipes
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default RecipeDetail;
