import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../features/store';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';
import api from '../services/api';
import { loginSuccess } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';

function EditProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setBio(user.bio || '');
      setLocation(user.location || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.put('/auth/me', { username, email, bio, location });
      dispatch(loginSuccess({ user: data, token: localStorage.getItem('token')! }));
      navigate('/profile');
    } catch (err) {
      setError('Failed to update profile.');
    }
  };

  return (
    <Container className="d-flex justify-content-center mt-5">
      <Card style={{ maxWidth: '600px', width: '100%' }} className="shadow-lg p-4">
        <Card.Body>
          <h2 className="text-center mb-4">✏️ Edit Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control value={username} onChange={(e) => setUsername(e.target.value)} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control value={email} onChange={(e) => setEmail(e.target.value)} required type="email" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control as="textarea" value={bio} onChange={(e) => setBio(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Location</Form.Label>
              <Form.Control value={location} onChange={(e) => setLocation(e.target.value)} />
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button type="submit" variant="primary">💾 Save</Button>
              <Button variant="secondary" onClick={() => navigate('/profile')}>Cancel</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default EditProfile;
