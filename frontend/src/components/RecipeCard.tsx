// components/RecipeCard.tsx
import { Card, Button, ButtonGroup, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteMyRecipe } from '../features/recipeSlice';
import api, { API_BASE } from '../services/api';
import { RootState } from '../features/store';

import { Recipe } from '../types/recipe.types';

interface RecipeCardProps {
  recipe: Recipe;
  isEditable?: boolean;
}

function RecipeCard({ recipe, isEditable = false }: RecipeCardProps) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleDelete = async () => {
    if (!user || user.guest) {
      alert('You have to log in/register to do this action.');
      return;
    }
    await api.delete(`/recipes/${recipe.id}`);
    dispatch(deleteMyRecipe(`${recipe.id}`));
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Img
        variant="top"
        src={recipe.image?.startsWith('/uploads/') ? `${API_BASE}${recipe.image}` : recipe.image}
        alt={recipe.title}
        style={{ height: '200px', objectFit: 'cover' }}
      />

      <Card.Body>
        {/* 👤 Author */}
        {recipe.author && (
          <div className="d-flex align-items-center mb-2">
            <img
              src={recipe.author?.avatar || '/avatars/default.png'}
              alt={recipe.author.name}
              className="rounded-circle me-2"
              width="40"
              height="40"
            />
            <strong>{recipe.author.name}</strong>
          </div>
        )}

        <Card.Title>{recipe.title}</Card.Title>

        <Card.Text style={{ height: '70px', overflow: 'hidden' }}>
          {recipe.description}
        </Card.Text>

        {/* 🕒 Metadata */}
        <div className="d-flex justify-content-between mb-2 text-muted small">
          <span>{recipe.cookingTime} min • {recipe.difficulty}</span>
          <span>⭐ {recipe.rating} ({recipe.reviewCount})</span>
        </div>

        {/* ❤️ Likes / 💾 Saves (for owner view) */}
        {isEditable && (
          <div className="d-flex justify-content-between mb-2 text-muted small">
            <span>❤️ {recipe.likes ?? 0}</span>
            <span>💾 {recipe.savedBy?.length ?? 0}</span>
          </div>
        )}

        {/* 🏷️ Tags */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="mb-2">
            {recipe.tags.map((tag, i) => (
              <Badge key={i} bg="secondary" className="me-1">#{tag}</Badge>
            ))}
          </div>
        )}

        {/* 🔘 Action Buttons */}
        <ButtonGroup className="w-100 d-flex justify-content-between">
          <Link to={`/recipes/${recipe.id}`}>
            <Button variant="primary" className="me-2">
              View Recipe
            </Button>
          </Link>

          {isEditable && (
            <>
              <Link to={`/my-recipes/edit/${recipe.id}`}>
                <Button variant="warning" className="me-2">Edit</Button>
              </Link>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            </>
          )}
        </ButtonGroup>
      </Card.Body>
    </Card>
  );
}

export default RecipeCard;
