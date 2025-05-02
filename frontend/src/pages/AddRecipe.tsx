// src/pages/AddRecipe.tsx
import { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addMyRecipe } from '../features/recipeSlice';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function AddRecipe() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data } = await api.post('/recipes', { title, description, image });
    dispatch(addMyRecipe(data));
    navigate('/my-recipes');
  };
  
  return (
    <Container className="my-5">
      <Card className="shadow-sm p-4">
        <h2 className="mb-4 text-center">➕ Add Recipe</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control required value={title} onChange={e => setTitle(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control required value={description} onChange={e => setDescription(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Image URL</Form.Label>
            <Form.Control required value={image} onChange={e => setImage(e.target.value)} />
          </Form.Group>
          <Button variant="success" type="submit">Add Recipe</Button>
        </Form>
      </Card>
    </Container>
  );
}

export default AddRecipe;
