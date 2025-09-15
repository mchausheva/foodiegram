// src/components/Navbar.tsx
import { Navbar, Nav, Container, Button, Image } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../features/store';
import { logout } from '../features/authSlice';

function Navigation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const isGuest = !!user?.guest;
  const isAuthed = !!user;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
      <Navbar.Brand as={Link} to="/">
          <Image
            src="/logo.png"
            alt="FoodieGram"
            width="40"
            height="40"
            roundedCircle
          />
          <span className="ms-2">FoodieGram 🍽️</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/recipes" style={{ opacity: !isAuthed ? 0.5 : 1, pointerEvents: !isAuthed ? 'none' as const : undefined }}>Recipes</Nav.Link>
            <Nav.Link as={Link} to="/my-recipes" style={{ opacity: (!isAuthed || isGuest) ? 0.5 : 1, pointerEvents: (!isAuthed || isGuest) ? 'none' as const : undefined }}>My Recipes</Nav.Link>
            <Nav.Link as={Link} to="/saved-recipes" style={{ opacity: (!isAuthed || isGuest) ? 0.5 : 1, pointerEvents: (!isAuthed || isGuest) ? 'none' as const : undefined }}>Saved</Nav.Link>
            <Nav.Link as={Link} to="/profile" style={{ opacity: (!isAuthed || isGuest) ? 0.5 : 1, pointerEvents: (!isAuthed || isGuest) ? 'none' as const : undefined }}>Profile</Nav.Link>
            {user && !isGuest && user.role === 'admin' && (
              <Nav.Link as={Link} to="/admin">Admin</Nav.Link>
            )}
          </Nav>
          <Nav className="ms-auto">
            {user ? (
              isGuest ? (
                <Link to="/login">
                  <Button variant="outline-light">Login</Button>
                </Link>
              ) : (
                <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
              )
            ) : (
              <Link to="/login">
                <Button variant="outline-light">Login</Button>
              </Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
