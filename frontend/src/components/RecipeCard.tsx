// components/RecipeCard.tsx
import { Card, Button, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteMyRecipe } from '../features/recipeSlice';
import api from '../services/api';

interface RecipeCardProps {
  recipe: {
    id: string;
    title: string;
    description: string;
    image: string;
  };
  isEditable?: boolean;
}

function RecipeCard({ recipe, isEditable = false }: RecipeCardProps) {
  const dispatch = useDispatch();
  
  const handleDelete = async () => {
    await api.delete(`/recipes/${recipe.id}`);
    dispatch(deleteMyRecipe(recipe.id));
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Img variant="top" src={recipe.image} style={{ height: '200px', objectFit: 'cover' }} />
      <Card.Body>
        <Card.Title>{recipe.title}</Card.Title>
        <Card.Text style={{ height: '70px', overflow: 'hidden' }}>
          {recipe.description}
        </Card.Text>
        <ButtonGroup>
          
        <Link to={`/recipes/${recipe.id}`}>
                <Button variant="primary">
                View Recipe
                </Button>
            </Link>
          {isEditable && (
            <>
            <Link to={`/my-recipes/edit/${recipe.id}`}>
                <Button variant="warning">
                  Edit
                </Button>
            </Link>
              <Link to={`/my-recipes`}>
                <Button variant="danger" onClick={handleDelete}>
                  Delete
                </Button>
            </Link>
            </>
          )}
        </ButtonGroup>
      </Card.Body>
    </Card>
  );
}

export default RecipeCard;
