import { useState } from 'react';
import { Container, Form, Button, Card, Row, Col, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Category, Difficulty, Unit } from '../types/recipe.types';

function AddRecipe() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [ingredients, setIngredients] = useState([{ name: '', quantity: 0, unit: '', notes: '' }]);
  const [steps, setSteps] = useState([{ stepNumber: 1, instruction: '', duration: 0 }]);

  const [tags, setTags] = useState<string>('');
  const [cookingTime, setCookingTime] = useState<number>(0);
  const [servings, setServings] = useState<number>(1);
  const [difficulty, setDifficulty] = useState('Medium');
  const [category, setCategory] = useState('General');

  const [nutrition, setNutrition] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: 0, unit: '', notes: '' }]);
  };

  const handleAddStep = () => {
    setSteps([...steps, { stepNumber: steps.length + 1, instruction: '', duration: 0 }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Basic guard for guests/unauthed
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You have to log in/register to do this action.');
      return;
    }
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', JSON.stringify(tags.split(',').map(tag => tag.trim())));
    formData.append('ingredients', JSON.stringify(ingredients));
    formData.append('steps', JSON.stringify(steps));
    formData.append('cookingTime', cookingTime.toString());
    formData.append('servings', servings.toString());
    formData.append('difficulty', difficulty);
    formData.append('category', category);
    formData.append('nutrition', JSON.stringify(nutrition));
    if (imageFile) formData.append('image', imageFile);

    if (!title || !description || !imageFile) {
      alert('Please fill out all required fields including an image.');
      return;
    }

    if (ingredients.length === 0 || ingredients.some(i => !i.name)) {
      alert('Please add at least one valid ingredient.');
      return;
    }

    if (steps.length === 0 || steps.some(s => !s.instruction)) {
      alert('Please add at least one instruction step.');
      return;
    }

    if (cookingTime <= 0 || servings <= 0) {
      alert('Cooking time and servings must be greater than zero.');
      return;
    }

    const { data } = await api.post('/recipes', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    navigate(`/recipes/${data.id}`);
  };

  return (
    <Container className="my-5">
      <Card className="p-4 shadow">
        <h2 className="text-center mb-4">➕ Add New Recipe</h2>
        <Form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control value={title} onChange={e => setTitle(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control value={description} onChange={e => setDescription(e.target.value)} required as="textarea" />
          </Form.Group>

          {/* Image Upload */}
          <Form.Group className="mb-3">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              onChange={e => {
                const target = e.target as HTMLInputElement;
                setImageFile(target.files?.[0] || null);
              }}
            />
            {/* <Form.Control type="file" onChange={e => setImageFile(e.target.files?.[0] || null)} /> */}
            {imageFile && <img src={URL.createObjectURL(imageFile)} alt="preview" className="img-fluid mt-2" />}
          </Form.Group>

          {/* Ingredients */}
          <h5>🧂 Ingredients</h5>
          {ingredients.map((ing, i) => (
            <Row key={i} className="mb-2">
              <Col><Form.Control placeholder="Name" value={ing.name} onChange={(e) => {
                const newIng = [...ingredients];
                newIng[i].name = e.target.value;
                setIngredients(newIng);
              }} /></Col>
              <Col><Form.Control type="number" placeholder="Qty" value={ing.quantity} onChange={(e) => {
                const newIng = [...ingredients];
                newIng[i].quantity = parseFloat(e.target.value);
                setIngredients(newIng);
              }} /></Col>
              <Col><Form.Select
                value={ing.unit}
                onChange={(e) => {
                  const newIng = [...ingredients];
                  newIng[i].unit = e.target.value as Unit;
                  setIngredients(newIng);
                }}
              >
                {Object.values(Unit).map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </Form.Select></Col>
            </Row>
          ))}
          <Button size="sm" onClick={handleAddIngredient}>Add Ingredient</Button>

          {/* Steps */}
          <h5 className="mt-4">👨‍🍳 Steps</h5>
          {steps.map((step, i) => (
            <Form.Group key={i} className="mb-2">
              <Form.Label>Step {i + 1}</Form.Label>
              <Form.Control as="textarea" value={step.instruction} onChange={(e) => {
                const newSteps = [...steps];
                newSteps[i].instruction = e.target.value;
                setSteps(newSteps);
              }} />
            </Form.Group>
          ))}
          <Button size="sm" onClick={handleAddStep}>Add Step</Button>

          {/* Tags */}
          <Form.Group className="mt-4 mb-3">
            <Form.Label>Tags (comma separated)</Form.Label>
            <Form.Control value={tags} onChange={(e) => setTags(e.target.value)} />
          </Form.Group>

          {/* Timing + Nutrition */}
          <Row className="mb-3">
            <Col>
              <Form.Label>Cooking Time (min)</Form.Label>
              <Form.Control type="number" value={cookingTime} onChange={e => setCookingTime(Number(e.target.value))} />
            </Col>
            <Col>
              <Form.Label>Servings</Form.Label>
              <Form.Control type="number" value={servings} onChange={e => setServings(Number(e.target.value))} />
            </Col>
            <Col>
              <Form.Label>Difficulty</Form.Label>
              <Form.Select value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)}>
              {Object.values(Difficulty).map((diff) => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </Form.Select>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select value={category} onChange={(e) => setCategory(e.target.value as Category)}>
              {Object.values(Category).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <h5 className="mt-4">🍎 Nutrition</h5>
          {Object.entries(nutrition).map(([key, val]) => (
            <Form.Group key={key} className="mb-2">
              <Form.Label>{key}</Form.Label>
              <Form.Control type="number" value={val} onChange={(e) => {
                setNutrition({ ...nutrition, [key]: Number(e.target.value) });
              }} />
            </Form.Group>
          ))}
{/* 
          <Form.Check
            type="switch"
            label="Make this recipe public"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="mb-3"
          /> */}

          <div className="text-center mt-4">
            <Button type="submit" variant="success">✅ Submit Recipe</Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}

export default AddRecipe;
