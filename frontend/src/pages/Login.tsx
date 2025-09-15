// src/pages/Login.tsx
import { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { loginSuccess } from '../features/authSlice';
import { useDispatch } from 'react-redux';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', { email, password });
      dispatch(loginSuccess(data));
      navigate('/');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleGuest = async () => {
    try {
      const { data } = await api.post('/auth/guest');
      dispatch(loginSuccess(data));
      navigate('/recipes');
    } catch (err) {
      setError('Failed to continue as guest.');
    }
  };

  return (
    <Container className="auth-bg d-flex justify-content-center align-items-center">
      <Card style={{ width: '100%', maxWidth: '400px' }} className="auth-card">
        <Card.Body>
          <h3 className="mb-4 text-center">Login 🍽️</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Log In
            </Button>
          </Form>
          <Button variant="secondary" onClick={handleGuest} className="w-100 mt-3">
            Continue as Guest
          </Button>
          <p className="mt-3 text-center">
            Don't have an account? <Link to="/signup">Register</Link>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Login;
