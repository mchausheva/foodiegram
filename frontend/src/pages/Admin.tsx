import { useEffect, useState } from 'react';
import { Container, Tabs, Tab, Table, Button, Badge, Form, Row, Col, Card, Modal } from 'react-bootstrap';
import api, { API_BASE } from '../services/api';

interface AdminRecipe {
  id: string;
  title: string;
  author: { id: string; name: string };
  createdAt: string;
  status?: 'pending' | 'approved' | 'declined';
  declineReason?: string;
  description?: string;
  image?: string;
  cookingTime?: number;
  servings?: number;
  difficulty?: string;
  category?: string[];
  ingredients?: { name: string; quantity: number; unit: string; notes?: string }[];
  steps?: { stepNumber: number; instruction: string; duration?: number }[];
  tags?: string[];
  nutrition?: { [key: string]: number };
  draft?: Partial<AdminRecipe> | null;
}

interface AdminUser {
  id: string; username: string; email: string; active?: boolean; role?: 'user' | 'admin';
}

function AdminPage() {
  const [pending, setPending] = useState<AdminRecipe[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [banned, setBanned] = useState<string[]>([]);
  const [banInput, setBanInput] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [preview, setPreview] = useState<AdminRecipe | null>(null);
  const [useDraft, setUseDraft] = useState(false);

  const fetchAll = async () => {
    const [recipesRes, usersRes, bannedRes, catsRes] = await Promise.all([
      api.get('/recipes', { params: { sort: 'new', page: 1, limit: 10 } }),
      api.get('/auth/users'),
      api.get('/auth/banned-emails'),
      api.get('/recipes/categories')
    ]);
    const recipes = (recipesRes.data && (recipesRes.data.recipes || recipesRes.data)) as AdminRecipe[];
    setPending((recipes || []).filter((r: AdminRecipe) => r.status === 'pending'));
    setUsers(usersRes.data || []);
    setBanned(bannedRes.data || []);
    setCategories(catsRes.data || []);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const approve = async (id: string) => {
    await api.put(`/recipes/${id}/status`, { status: 'approved' });
    await fetchAll();
  };

  const decline = async (id: string) => {
    const reason = prompt('Enter decline reason (optional)') || '';
    await api.put(`/recipes/${id}/status`, { status: 'declined', reason });
    await fetchAll();
  };

  const toggleUserActive = async (id: string) => {
    await api.put(`/auth/users/${id}/toggle-active`);
    await fetchAll();
  };

  const addBan = async () => {
    if (!banInput.trim()) return;
    await api.post('/auth/banned-emails', { email: banInput.trim() });
    setBanInput('');
    await fetchAll();
  };

  const removeBan = async (email: string) => {
    await api.delete('/auth/banned-emails', { data: { email } });
    await fetchAll();
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    await api.post('/recipes/categories', { name: newCategory.trim() });
    setNewCategory('');
    await fetchAll();
  };

  const renameCategory = async (oldName: string) => {
    const name = prompt('New category name', oldName) || '';
    if (!name.trim()) return;
    await api.put(`/recipes/categories/${encodeURIComponent(oldName)}`, { name });
    await fetchAll();
  };

  const deleteCategory = async (name: string) => {
    await api.delete(`/recipes/categories/${encodeURIComponent(name)}`);
    await fetchAll();
  };

  return (
    <Container className="my-4">
      <h2 className="mb-3">🛠️ Admin</h2>
      <Tabs defaultActiveKey="pending" className="mb-3">
        <Tab eventKey="pending" title="Pending Recipes">
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Created</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pending.map(r => (
                <tr key={r.id}>
                  <td>{r.title}</td>
                  <td>{r.author?.name}</td>
                  <td>{new Date(r.createdAt).toLocaleString()}</td>
                  <td><Badge bg="warning">Pending</Badge></td>
                  <td className="d-flex gap-2">
                    <Button size="sm" variant="outline-primary" onClick={() => { setPreview(r as any); setUseDraft(!!(r as any).draft); }}>Review</Button>
                    <Button size="sm" variant="success" onClick={() => approve(r.id)}>Approve</Button>
                    <Button size="sm" variant="danger" onClick={() => decline(r.id)}>Decline</Button>
                  </td>
                </tr>
              ))}
              {pending.length === 0 && (
                <tr><td colSpan={5} className="text-center">No pending recipes 🎉</td></tr>
              )}
            </tbody>
          </Table>
        </Tab>

        <Tab eventKey="users" title="Users">
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td><Badge bg={u.role === 'admin' ? 'primary' : 'secondary'}>{u.role || 'user'}</Badge></td>
                  <td>{u.active ? 'Yes' : 'No'}</td>
                  <td>
                    <Button size="sm" variant={u.active ? 'outline-danger' : 'outline-success'} onClick={() => toggleUserActive(u.id)}>
                      {u.active ? 'Deactivate' : 'Activate'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>

        <Tab eventKey="banned" title="Banned Emails">
          <Row>
            <Col md={6}>
              <Card className="p-3 mb-3">
                <Form onSubmit={(e)=>{ e.preventDefault(); addBan(); }}>
                  <Form.Label>Add Email</Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Control value={banInput} onChange={(e)=>setBanInput(e.target.value)} placeholder="email@example.com" />
                    <Button onClick={addBan}>Add</Button>
                  </div>
                </Form>
              </Card>
              <Table bordered hover>
                <thead><tr><th>Email</th><th></th></tr></thead>
                <tbody>
                  {banned.map(email => (
                    <tr key={email}>
                      <td>{email}</td>
                      <td className="text-end"><Button size="sm" variant="outline-danger" onClick={()=>removeBan(email)}>Remove</Button></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="categories" title="Categories">
          <Row>
            <Col md={6}>
              <Card className="p-3 mb-3">
                <Form onSubmit={(e)=>{ e.preventDefault(); addCategory(); }}>
                  <Form.Label>Add Category</Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Control value={newCategory} onChange={(e)=>setNewCategory(e.target.value)} placeholder="Category name" />
                    <Button onClick={addCategory}>Add</Button>
                  </div>
                </Form>
              </Card>
              <Table bordered hover>
                <thead><tr><th>Name</th><th></th></tr></thead>
                <tbody>
                  {categories.map(c => (
                    <tr key={c}>
                      <td>{c}</td>
                      <td className="text-end d-flex gap-2 justify-content-end">
                        <Button size="sm" variant="outline-secondary" onClick={()=>renameCategory(c)}>Rename</Button>
                        <Button size="sm" variant="outline-danger" onClick={()=>deleteCategory(c)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Tab>
      </Tabs>

      <Modal show={!!preview} onHide={() => setPreview(null)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Review Recipe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {preview && (
            <>
              <h4>{(useDraft && preview.draft?.title) || preview.title}</h4>
              <p className="text-muted">by {preview.author?.name}</p>
              <img
                src={(() => {
                  const img = (useDraft && preview.draft?.image) || preview.image || '';
                  return img.startsWith('/uploads/') ? `${API_BASE}${img}` : img;
                })()}
                alt="preview"
                style={{ maxWidth: '100%', borderRadius: 8, marginBottom: 12, objectFit: 'cover' }}
              />
              <p>{(useDraft && preview.draft?.description) || preview.description}</p>
              <Row className="mb-3">
                <Col>⏱ {(useDraft && preview.draft?.cookingTime) || preview.cookingTime} min</Col>
                <Col>🍽 {(useDraft && preview.draft?.servings) || preview.servings} servings</Col>
                <Col>👨‍🍳 {(useDraft && preview.draft?.difficulty) || preview.difficulty}</Col>
              </Row>
              <h6>Categories</h6>
              <div className="mb-2">
                {(((useDraft && preview.draft?.category) || preview.category) || []).map((c)=> (
                  <Badge bg="secondary" key={c} className="me-1">{c}</Badge>
                ))}
              </div>
              <h6>Ingredients</h6>
              <ul>
                {(((useDraft && preview.draft?.ingredients) || preview.ingredients) || []).map((i,idx)=> (
                  <li key={idx}>{i.quantity} {i.unit} {i.name} {i.notes && `(${i.notes})`}</li>
                ))}
              </ul>
              <h6>Tags</h6>
              <div className="mb-2">
                {(((useDraft && preview.draft?.tags) || preview.tags) || []).map((t)=> (
                  <Badge bg="secondary" key={t} className="me-1">#{t}</Badge>
                ))}
              </div>
              <h6>Steps</h6>
              <ol>
                {(((useDraft && preview.draft?.steps) || preview.steps) || []).map((s,idx)=> (
                  <li key={idx}>{s.instruction} {s.duration ? `(${s.duration} min)` : ''}</li>
                ))}
              </ol>
              <h6>Nutrition</h6>
              <div className="d-flex flex-wrap gap-2">
                {Object.entries((((useDraft && preview.draft?.nutrition) || preview.nutrition) || {})).map(([k,v])=> (
                  <Badge bg="info" key={k} className="text-dark">{k}: {v}</Badge>
                ))}
              </div>
              {(preview as any).draft && (
                <Form.Check
                  type="switch"
                  id="use-draft"
                  label="Preview pending draft changes"
                  checked={useDraft}
                  onChange={(e)=>setUseDraft(e.target.checked)}
                  className="mt-2"
                />
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {preview && (
            <>
              <Button variant="success" onClick={() => { approve(preview.id); setPreview(null); }}>Approve</Button>
              <Button variant="danger" onClick={() => { decline(preview.id); setPreview(null); }}>Decline</Button>
              <Button variant="secondary" onClick={() => setPreview(null)}>Close</Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AdminPage;


