// src/pages/EditRecipe.tsx
import { useState, useEffect } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { editMyRecipe } from '../features/recipeSlice';
import { RootState } from '../features/store';
import api from '../services/api';

function EditRecipe() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const recipeToEdit = useSelector((state: RootState) => 
    state.recipes.myRecipes.find(r => r.id === id)
  );

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    if (recipeToEdit) {
      setTitle(recipeToEdit.title);
      setDescription(recipeToEdit.description);
      setImage(recipeToEdit.image);
    }
  }, [recipeToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data } = await api.put(`/recipes/${id}`, { title, description, image });
    dispatch(editMyRecipe(data));
    navigate('/my-recipes');
  };

  if (!recipeToEdit) return <Container>Recipe not found!</Container>;

  return (
    <Container className="my-5">
      <Card className="shadow-sm p-4">
        <h2 className="mb-4 text-center">✏️ Edit Recipe</h2>
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
          <Button variant="warning" type="submit">Update Recipe</Button>
        </Form>
      </Card>
    </Container>
  );
}

export default EditRecipe;
