// src/pages/Profile.tsx
import { Container, Card, Button, Col, Row, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../features/store';
import Validator from './Validator';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import api from '../services/api';
import { setMyRecipes } from '../features/recipeSlice';

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const isGuest = !!user?.guest;
  const myRecipes = useSelector((state: RootState) => state.recipes.myRecipes);
  const savedList = useSelector((state: RootState) => state.recipes.savedRecipes);

  useEffect(() => {
    const loadMine = async () => {
      if (!user) return;
      try {
        const { data } = await api.get('/recipes/mine');
        dispatch(setMyRecipes(data));
      } catch {}
    };
    loadMine();
  }, [user, dispatch]);

  return (
    <Container className="my-3" style={{ opacity: isGuest ? 0.5 : 1 }}>
      <h2 className="text-center my-4">👤 Profile</h2>
      {!user ? (
        <>
        <Container className="text-center mt-5">
        <h2>You are not logged in</h2>
      </Container>
        <Validator/>
        </>
      ) : (

      <Container fluid className="align-items-center justify-content-center">
       <Card className="shadow-lg w-100 p-4" style={{ height: '67vh' }}>
        <Card.Body className="text-center">
          {isGuest && (
            <Alert variant="info" className="text-center">You are browsing as Guest. Log in/register to manage your profile.</Alert>
          )}
          <h2 className="mb-2">👤 Profile</h2>

          <h4>{user.username}</h4>
          <p className="text-muted">Email: {user.email}</p>

          {user.bio && <p><strong>Bio:</strong> {user.bio}</p>}
          {user.location && <p><strong>Location:</strong> {user.location}</p>}
          {user.joinedAt && (
            <p><strong>Joined:</strong> {new Date(user.joinedAt).toLocaleDateString()}</p>
          )}
          <hr className="my-4" />

          <h5 className="text-center mb-3">📊 Your Stats</h5>
          <Row className="text-center">
            <Col md={4}>
              <Card bg="light" className="mb-3">
                <Card.Body>
                  <h4>{myRecipes.length}</h4>
                  <p className="mb-0">Recipes Created</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card bg="light" className="mb-3">
                <Card.Body>
                  <h4>
                    {myRecipes.reduce((sum, r) => sum + (r.likes ?? 0), 0)}
                  </h4>
                  <p className="mb-0">Total Likes</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card bg="light" className="mb-3">
                <Card.Body>
                  <h4>
                    {savedList.length}
                  </h4>
                  <p className="mb-0">Saved Recipes</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>                              

          <Button variant="warning" onClick={() => navigate('/profile/edit')}>✏️ Edit Profile</Button>
        </Card.Body>
      </Card>
      </Container>
      )}
    </Container>
  );
}

export default Profile;
