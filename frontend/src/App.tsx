// App.tsx
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Container } from 'react-bootstrap';

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <Container className="flex-grow-1 py-4">
        <Outlet />
      </Container>
      <Footer />
    </div>
  );
}

export default App;
