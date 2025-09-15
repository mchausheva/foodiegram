import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Container, Row, Carousel, Image, Button } from 'react-bootstrap';
import api from '../services/api';
import { setRecipes } from '../features/recipeSlice';
import RecipeCard from '../components/RecipeCard';
import { RootState } from '../features/store';
// import Validator from './Validator';
import { Link, useNavigate } from 'react-router-dom';
import { loginSuccess } from '../features/authSlice';

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const isGuest = !!user?.guest;
  const recipes = useSelector((state: RootState) => state.recipes.recipes);
  const carouselImages = useMemo(() => [
    '/recipes/salmon.jpg',
    '/recipes/margarita-pizza.jpg',
    '/recipes/caprese.jpg',
    '/recipes/risotto.jpg',
    '/recipes/avocado-toast.jpg',
    '/recipes/strawberry-cheesecake.jpg'
  ], []);

  useEffect(() => {
    const fetchRecipes = async () => {
      const { data } = await api.get('/recipes');
      // API now returns { recipes, total, page, limit, totalPages }
      dispatch(setRecipes((data as any).recipes || data));
    };
    fetchRecipes();
  }, [dispatch]);

  const handleGuest = async () => {
    try {
      const { data } = await api.post('/auth/guest');
      dispatch(loginSuccess(data));
      navigate('/recipes');
    } catch {
      // ignore
    }
  };

  return (
  <Container className="text-center my-5">
    {/* Hero Carousel with static overlay */}
    <div style={{ position: 'relative' }}>
      <Carousel className="mb-6" interval={3000} controls={false} indicators>
        {carouselImages.map((src, idx) => (
          <Carousel.Item key={idx}>
            <Image
              src={src}
              alt={`Featured recipe ${idx + 1}`}
              fluid
              style={{ maxHeight: 520, objectFit: 'cover', width: '100%' }}
            />
          </Carousel.Item>
        ))}
      </Carousel>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
          width: '100%',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            background: 'rgba(0,0,0,0.45)',
            borderRadius: 12,
            padding: '16px 24px'
          }}
        >
          <h1 className="mb-2 text-white">Welcome to FoodieGram! 🍽️</h1>
          <p className="mb-3 fs-4 text-white">👨‍🍳 Discover, Cook, Share.</p>
          {!user ? (
            <div className="d-flex gap-2 justify-content-center">
              <Link to="/login"><Button variant="light">Log In</Button></Link>
              <Link to="/signup"><Button variant="success">Sign Up</Button></Link>
              <Button variant="outline-light" onClick={handleGuest}>Continue as Guest</Button>
            </div>
          ) : (
            isGuest ? (
              <Link to="/recipes"><Button variant="light">Browse Recipes</Button></Link>
            ) : (
              <div className="d-flex gap-2 justify-content-center">
                <Link to="/recipes"><Button variant="light">All Recipes</Button></Link>
                <Link to="/my-recipes"><Button variant="light">My Recipes</Button></Link>
                <Link to="/saved-recipes"><Button variant="light">Saved Recipes</Button></Link>
              </div>
            )
          )}
        </div>
      </div>
    </div>
{/* 
    {user ? (
      <>
        <Row className="mt-4">
          {recipes.map((recipe) => (
            <Col key={recipe.id} sm={12} md={6} lg={4}>
              <RecipeCard recipe={recipe} />
            </Col>
          ))}
        </Row>
      </>
    ) : null} */}
  </Container>
);

}

export default Home;
