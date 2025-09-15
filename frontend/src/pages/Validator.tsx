import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../features/authSlice";

function Validator() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGuest = async () => {
    try {
      const { data } = await api.post('/auth/guest');
      dispatch(loginSuccess(data));
      navigate('/recipes');
    } catch (err) {
      // no-op
    }
  };

  return (
      <div className="text-center my-5">
        <p className="lead">Create and share delicious recipes with the world!</p>
        <div className="d-flex justify-content-center gap-3 mt-4">
          <Link to="/login">
            <Button variant="outline-primary">Log In</Button>
          </Link>
          <Link to="/signup">
            <Button variant="primary">Sign Up</Button>
          </Link>
          <Button variant="secondary" onClick={handleGuest}>Continue as Guest</Button>
        </div>
      </div>
    );
}

export default Validator; 