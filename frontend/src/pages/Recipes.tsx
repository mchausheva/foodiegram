// src/pages/Recipes.tsx
import { Container, Row, Col } from 'react-bootstrap';
import RecipeCard from '../components/RecipeCard';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setRecipes } from '../features/recipeSlice';
import api from '../services/api';

const mockRecipes = [
  {
    id: '1',
    title: 'Classic Spaghetti Carbonara',
    image: '/carbonara.jpg',
    description: 'A quick, classic pasta dish made with eggs, cheese, pancetta, and pepper.',
  },
  {
    id: '2',
    title: 'Chicken Alfredo',
    image: '/alfredo.jpg',
    description: 'Creamy Alfredo sauce combined with tender chicken pieces and fettuccine pasta.',
  },
  {
    id: '3',
    title: 'Fresh Caprese Salad',
    image: '/caprese.jpg',
    description: 'Refreshing salad with ripe tomatoes, fresh mozzarella, basil, olive oil, and balsamic glaze.',
  },
  {
    id: '4',
    title: 'Vegan Buddha Bowl',
    image: '/buddha.jpg',
    description: 'Healthy bowl loaded with quinoa, chickpeas, fresh vegetables, avocado, and tahini dressing.',
  },
];

function Recipes() {
      const dispatch = useDispatch();
      // const recipes = useSelector((state: RootState) => state.recipes.recipes);

    useEffect(() => {
      const fetchRecipes = async () => {
        const { data } = await api.get('/recipes');
        dispatch(setRecipes(data));
      };
    
      fetchRecipes();
    }, [dispatch]);
    
  return (
    <Container>
      <h2 className="text-center my-4">🍽️ Recipes</h2>
      <Row>
        {mockRecipes.map((recipe) => (
          <Col key={recipe.id} sm={12} md={6} lg={4} xl={3}>
            <RecipeCard recipe={recipe} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Recipes;
