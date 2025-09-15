// src/pages/EditRecipe.tsx
import { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Row, Col, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { editMyRecipe } from '../features/recipeSlice';
import { RootState } from '../features/store';
import api, { API_BASE } from '../services/api';
import { Difficulty, Unit } from '../types/recipe.types';

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
  const [ingredients, setIngredients] = useState<{ name: string; quantity: number; unit: string; notes?: string }[]>([]);
  const [steps, setSteps] = useState<{ stepNumber: number; instruction: string; duration?: number }[]>([]);
  const [tags, setTags] = useState<string>('');
  const [cookingTime, setCookingTime] = useState<number>(0);
  const [servings, setServings] = useState<number>(1);
  const [difficulty, setDifficulty] = useState<string>('Medium');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [nutrition, setNutrition] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

  useEffect(() => {
    if (recipeToEdit) {
      setTitle(recipeToEdit.title);
      setDescription(recipeToEdit.description);
      setImage(recipeToEdit.image);
      setIngredients(recipeToEdit.ingredients || []);
      setSteps([...(recipeToEdit.steps || [])].sort((a, b) => a.stepNumber - b.stepNumber));
      setTags((recipeToEdit.tags || []).join(', '));
      setCookingTime(recipeToEdit.cookingTime || 0);
      setServings(recipeToEdit.servings || 1);
      setDifficulty((recipeToEdit.difficulty as any) || 'Medium');
      setSelectedCategories((recipeToEdit.category as any) || []);
      setNutrition(recipeToEdit.nutrition || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
    }
  }, [recipeToEdit]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data } = await api.get('/recipes/categories');
        setCategories(data || []);
      } catch {}
    };
    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      description,
      image,
      ingredients: JSON.stringify(ingredients),
      steps: JSON.stringify(steps),
      tags: JSON.stringify(tags.split(',').map(t => t.trim()).filter(Boolean)),
      cookingTime,
      servings,
      difficulty,
      category: JSON.stringify(selectedCategories),
      nutrition: JSON.stringify(nutrition)
    } as any;
    const { data } = await api.put(`/recipes/${id}`, payload);
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
            {(image || recipeToEdit?.image) && (
              <img
                src={(image || recipeToEdit?.image).startsWith('/uploads/') ? `${API_BASE}${image || recipeToEdit?.image}` : (image || recipeToEdit?.image)}
                alt="current"
                className="img-fluid mt-2"
                style={{ maxHeight: 240, objectFit: 'cover' }}
              />
            )}
          </Form.Group>

          <hr />
          <h5 className="mb-2">🧂 Ingredients</h5>
          {ingredients.map((ing, i) => (
            <Row key={i} className="mb-2">
              <Col md={4}><Form.Control placeholder="Name" value={ing.name} onChange={(e)=>{
                const a=[...ingredients]; a[i].name=e.target.value; setIngredients(a);
              }} /></Col>
              <Col md={2}><Form.Control type="number" placeholder="Qty" value={ing.quantity} onChange={(e)=>{
                const a=[...ingredients]; a[i].quantity=parseFloat(e.target.value || '0'); setIngredients(a);
              }} /></Col>
              <Col md={3}><Form.Select value={ing.unit} onChange={(e)=>{
                const a=[...ingredients]; a[i].unit=e.target.value; setIngredients(a);
              }}>
                {Object.values(Unit).map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </Form.Select></Col>
              <Col md={3}><Form.Control placeholder="Notes" value={ing.notes || ''} onChange={(e)=>{
                const a=[...ingredients]; a[i].notes=e.target.value; setIngredients(a);
              }} /></Col>
            </Row>
          ))}
          <Button size="sm" variant="outline-secondary" className="mb-3" onClick={()=>setIngredients([...ingredients, { name: '', quantity: 0, unit: Unit.GRAMS }])}>Add Ingredient</Button>

          <h5 className="mb-2">👨‍🍳 Steps</h5>
          {steps.map((stp, i) => (
            <Row key={i} className="mb-2">
              <Col md={1}><Form.Control type="number" value={stp.stepNumber} onChange={(e)=>{
                const a=[...steps]; a[i].stepNumber=parseInt(e.target.value || '0',10); setSteps(a);
              }} /></Col>
              <Col md={9}><Form.Control as="textarea" value={stp.instruction} onChange={(e)=>{
                const a=[...steps]; a[i].instruction=e.target.value; setSteps(a);
              }} /></Col>
              <Col md={2}><Form.Control type="number" placeholder="min" value={stp.duration || 0} onChange={(e)=>{
                const a=[...steps]; a[i].duration=parseInt(e.target.value || '0',10); setSteps(a);
              }} /></Col>
            </Row>
          ))}
          <Button size="sm" variant="outline-secondary" className="mb-3" onClick={()=>setSteps([...steps, { stepNumber: steps.length+1, instruction: '', duration: 0 }])}>Add Step</Button>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Label>Cooking Time (min)</Form.Label>
              <Form.Control type="number" value={cookingTime} onChange={(e)=>setCookingTime(parseInt(e.target.value||'0',10))} />
            </Col>
            <Col md={4}>
              <Form.Label>Servings</Form.Label>
              <Form.Control type="number" value={servings} onChange={(e)=>setServings(parseInt(e.target.value||'1',10))} />
            </Col>
            <Col md={4}>
              <Form.Label>Difficulty</Form.Label>
              <Form.Select value={difficulty} onChange={(e)=>setDifficulty(e.target.value)}>
                {Object.values(Difficulty).map(d => <option key={d} value={d}>{d}</option>)}
              </Form.Select>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Categories</Form.Label>
            <div className="d-flex flex-wrap gap-3">
              {categories.map(cat => (
                <Form.Check
                  key={cat}
                  type="checkbox"
                  id={`cat-${cat}`}
                  label={<Badge bg={selectedCategories.includes(cat) ? 'primary' : 'secondary'}>{cat}</Badge> as any}
                  checked={selectedCategories.includes(cat)}
                  onChange={()=>setSelectedCategories(prev=> prev.includes(cat) ? prev.filter(c=>c!==cat) : [...prev, cat])}
                />
              ))}
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tags (comma separated)</Form.Label>
            <Form.Control value={tags} onChange={(e)=>setTags(e.target.value)} />
          </Form.Group>

          <h5 className="mb-2">🍎 Nutrition</h5>
          <Row className="mb-3">
            {Object.entries(nutrition).map(([k,v]) => (
              <Col md={2} key={k}>
                <Form.Label className="text-capitalize">{k}</Form.Label>
                <Form.Control type="number" value={v as number} onChange={(e)=>setNutrition({ ...nutrition, [k]: Number(e.target.value) })} />
              </Col>
            ))}
          </Row>

          <Button variant="warning" type="submit">Update Recipe</Button>
        </Form>
      </Card>
    </Container>
  );
}

export default EditRecipe;
