// src/pages/Profile.tsx
import { Container, Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { RootState } from '../features/store';

function Profile() {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) return <Container className="text-center"><p>Please log in to view your profile.</p></Container>;

  return (
    <Container className="my-5">
      <Card className="shadow-lg text-center">
        <Card.Body>
          <Card.Title className="display-6">👤 {user.username}</Card.Title>
          <Card.Text>Email: {user.email}</Card.Text>
          <Card.Text>Total Recipes: [display user stats here]</Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Profile;
