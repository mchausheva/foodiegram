// src/App.tsx
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Navbar />
      <Container className="my-4">
        <Outlet />
      </Container>
      <Footer />
    </>
  );
}

export default App;
