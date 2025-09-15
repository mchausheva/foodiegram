// src/pages/RecipeDetail.tsx
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCommentToCurrentRecipe, addSavedRecipe, removeSavedRecipe, setCurrentRecipe } from '../features/recipeSlice';
import { RootState } from '../features/store';
import api, { API_BASE } from '../services/api';
import { Container, Card, Badge, Button, Row, Col, Form } from 'react-bootstrap';
import { GiKnifeFork, GiTomato, GiCookingPot } from 'react-icons/gi';
import { formatDistanceToNow } from 'date-fns';

function RecipeDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [newComment, setNewComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const dispatch = useDispatch();
  const recipe = useSelector((state: RootState) => state.recipes.currentRecipe);
  const user = useSelector((state: RootState) => state.auth.user);
  const isOwner = user?.id === `${recipe?.author.id}`;

  const handleSaveToggle = async () => {
  if (!recipe) return;
  if (!user || user.guest) {
    alert('You have to log in/register to do this action.');
    return;
  }

  try {
    const { data } = await api.put(`/recipes/${recipe.id}/save`, {
      userId: user.id
    });
    const isNowSaved = data.savedBy.includes(user.id);
    setSaved(isNowSaved);
    if (isNowSaved) {
      // keep Redux saved list in sync
      dispatch(addSavedRecipe(data));
    } else {
      dispatch(removeSavedRecipe(data.id));
    }
  } catch (err) {
    console.error('Failed to save/unsave recipe:', err);
  }
};

  const handleLike = async () => {
  if (!recipe) return;
  if (!user || user.guest) {
    alert('You have to log in/register to do this action.');
    return;
  }

  try {
    const { data } = await api.put(`/recipes/${recipe.id}/like`, {
      userId: user.id
    });
    setLikes(data.likes); // updates the UI
    setLiked(data.likedBy.includes(user.id));
  } catch (err) {
    console.error('Failed to like/unlike recipe:', err);
  }
};

  const handleDelete = async () => {
    await api.delete(`/recipes/${recipe?.id}`);
    navigate('/my-recipes');
  };

  const handleAddComment = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!newComment.trim() || !recipe) return;
  if (!user || user.guest) {
    alert('You have to log in/register to do this action.');
    return;
  }
  try {
    const { data } = await api.post(`/recipes/${recipe.id}/comments`, {
      text: newComment.trim(),
      anonymous: isAnonymous,
    });
    // Update Redux or local state if needed
    dispatch(addCommentToCurrentRecipe(data));
    setNewComment('');
    setIsAnonymous(false);
  } catch (err) {
    console.error('Failed to post comment:', err);
  }
};

  useEffect(() => {
  if (recipe && user) {
    setSaved(recipe.savedBy?.includes(user.id) || false);
    setLiked(recipe.likedBy?.includes(user.id) || false);
    setLikes(recipe.likes ?? 0);
  }
}, [recipe, user]);

  useEffect(() => {
    const fetchRecipe = async () => {
      const { data } = await api.get(`/recipes/${id}`);
      dispatch(setCurrentRecipe(data));
    };
    fetchRecipe();
  }, [id, dispatch]);

  if (!recipe) return <p>Loading recipe...</p>;

  return (
    <Container className="my-5">
      <Card className="shadow-lg">
        <Card.Img variant="top" src={recipe.image?.startsWith('/uploads/') ? `${API_BASE}${recipe.image}` : recipe.image} style={{ maxHeight: 400, objectFit: 'cover' }} />
        <Card.Body>
          {/* Author & Meta */}
          <div className="d-flex align-items-center mb-3">
            <img
              src={recipe.author.avatar}
              alt={recipe.author.name}
              width="40"
              height="40"
              className="rounded-circle me-2"
            />
            <strong>{recipe.author.name}</strong>
            <small className="ms-auto text-muted">
              {new Date(recipe.createdAt).toLocaleDateString()}
            </small>
          </div>

          {/* Title, Tags, Description */}
          <Card.Title className="display-6">{recipe.title}</Card.Title>
          {recipe.status && (
            <div className="mb-2">
              <span className={`badge bg-${recipe.status === 'approved' ? 'success' : recipe.status === 'pending' ? 'warning' : 'danger'}`}>
                {recipe.status}
              </span>
              {recipe.status === 'declined' && recipe.declineReason && (
                <small className="ms-2 text-danger">Reason: {recipe.declineReason}</small>
              )}
            </div>
          )}
          <div className="mb-3">
            {recipe.tags.map((tag, i) => (
              <Badge key={i} bg="secondary" className="me-1">#{tag}</Badge>
            ))}
          </div>
          <Card.Text>{recipe.description}</Card.Text>

          {/* Recipe Stats */}
          <Row className="text-center mb-4">
            <Col><strong>⏱️ {recipe.cookingTime} min</strong></Col>
            <Col><strong>👨‍🍳 {recipe.difficulty}</strong></Col>
            <Col><strong>🍽️ Serves {recipe.servings}</strong></Col>
          </Row>

          {/* Ingredients */}
          <hr />
          <h4><GiTomato /> Ingredients</h4>
          <ul className="list-group mb-4">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className="list-group-item">
                {ing.quantity} {ing.unit} {ing.name} {ing.notes && `(${ing.notes})`}
              </li>
            ))}
          </ul>

          {/* Steps */}
          <h4><GiCookingPot /> Steps</h4>
          <ol className="list-group list-group-numbered">
            {recipe.steps.map((step) => (
              <li key={step.stepNumber} className="list-group-item">
                {step.instruction} {step.duration && `(${step.duration} min)`}
              </li>
            ))}
          </ol>

          {/* Nutrition */}
          <hr />
          <h5 className="mt-4">Nutrition Info</h5>
          <ul className="list-inline">
            {Object.entries(recipe.nutrition).map(([key, value]) => (
              <li className="list-inline-item me-3" key={key}>
                <Badge bg="info">{key}: {value}</Badge>
              </li>
            ))}
          </ul>

          {/* Like and save buttons */}
          {!isOwner && (
            <div className="d-flex gap-3 justify-content-center my-3">
              <Button
                variant={saved ? 'success' : 'outline-success'}
                onClick={handleSaveToggle}
              >
                {saved ? '💾 Saved' : '💾 Save'}
              </Button>
              <Button
                variant={liked ? 'danger' : 'outline-danger'}
                onClick={handleLike}
              >
                {liked ? `❤️ ${likes} Likes` : '♡ Like'}
              </Button>
            </div>
          )}

          {/* Edit/Delete buttons for owner */}
          {isOwner && (
            <div className="d-flex gap-3 justify-content-center my-3">
              <Link to={`/my-recipes/edit/${recipe.id}`}>
                <Button variant="warning">✏️ Edit</Button>
              </Link>
              <Button variant="danger" onClick={handleDelete}>🗑️ Delete</Button>
            </div>
          )}

          <div className="text-center mt-4">
            <Button variant="outline-primary" onClick={() => navigate(-1)}>
              <GiKnifeFork className="me-1" /> Back to Recipes
            </Button>
          </div>

          <h4 className="mt-5 mb-3">💬 Comments</h4>

          {recipe.comments && recipe.comments.length > 0 ? (
            <ul className="list-group mb-4">
              {recipe.comments.map((comment) => (
                <li className="list-group-item d-flex justify-content-between align-items-start" key={comment.id}>
                  <div><strong>{comment.user}:</strong> {comment.text}</div>
                  <small>{formatDistanceToNow(new Date(comment.createdAt))} ago</small>
                </li>
              ))}
            </ul>
          ) : (
            <p>No comments yet.</p>
          )}

          <Form onSubmit={handleAddComment}>
            <Form.Group className="mb-3">
              <Form.Control
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                id="comment-anon"
                label="Post as Anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
              />
            </Form.Group>
            <Button type="submit" variant="primary">Add Comment</Button>
          </Form>

        </Card.Body>
      </Card>
    </Container>
  );
}

export default RecipeDetail;
