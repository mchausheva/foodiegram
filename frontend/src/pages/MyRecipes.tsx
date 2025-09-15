// src/pages/MyRecipes.tsx
import { Container, Row, Col, Button, Alert, Badge, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { RootState } from '../features/store';
import RecipeCard from '../components/RecipeCard';
import { Link } from 'react-router-dom';
import Validator from './Validator';
import { useEffect } from 'react';
import api from '../services/api';
import { useDispatch } from 'react-redux';
import { setMyRecipes } from '../features/recipeSlice';

function MyRecipes() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const isGuest = !!user?.guest;
  const myRecipes = useSelector((state: RootState) => state.recipes.myRecipes);
  const [statusFilter, setStatusFilter] = useState<'all'|'pending'|'approved'|'declined'>('all');

  useEffect(() => {
  const fetchMyRecipes = async () => {
    const { data } = await api.get('/recipes/mine');
    dispatch(setMyRecipes(data));
  };
  fetchMyRecipes();
}, []);

  return (
    <Container style={{ opacity: isGuest ? 0.5 : 1 }}>
      <h2 className="text-center my-4">👩‍🍳 My Recipes</h2>
      {isGuest && (
        <Alert variant="info" className="text-center">You are browsing as Guest. Log in/register to manage your recipes.</Alert>
      )}

      {!user ? (
        <Validator/>
      ) : (
      <>
        <div className="text-center mb-4">
          <Link to="/my-recipes/add" onClick={(e)=>{ if (!user || (user as any).guest){ e.preventDefault(); alert('You have to log in/register to do this action.');}}}>
            <Button variant="success">+ Add New Recipe</Button>
          </Link>
        </div>

        {myRecipes.length === 0 ? (
          <p className="text-center">You haven't created any recipes yet.</p>
        ) : (
          <>
          <Form.Select className="mb-3" style={{ maxWidth: 240 }} value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value as any)}>
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="declined">Declined</option>
          </Form.Select>
          <Row>
            {myRecipes.filter(r => statusFilter==='all' ? true : r.status===statusFilter).map(recipe => (
              <Col key={recipe.id} sm={12} md={6} lg={4}>
                <div className="position-relative">
                  {recipe.status && (
                    <Badge bg={{ pending: 'warning', approved: 'success', declined: 'danger' }[recipe.status] as any} className="position-absolute" style={{ top: 8, right: 8 }}>
                      {recipe.status}
                    </Badge>
                  )}
                  <RecipeCard recipe={recipe} isEditable />
                  {recipe.status === 'declined' && recipe.declineReason && (
                    <small className="text-danger d-block mt-1">Reason: {recipe.declineReason}</small>
                  )}
                </div>
              </Col>
            ))}
          </Row>
          </>
        )}
        </>
    )}
    </Container>
  );
}

export default MyRecipes;
