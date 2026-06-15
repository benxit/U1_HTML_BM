import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  Container,
  Form,
  Spinner
} from "react-bootstrap";

import { loginUser, saveSession } from "../services/authService";
import logoSportClub from "../assets/logo_empresa_letra_v1.png";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginUser({
        email,
        password,
      });

      saveSession(
        data.data.token,
        data.data.user
      );

      if (data.data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (data.data.user.role === "coach") {
        navigate("/coach/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      fluid
      className="login-page d-flex justify-content-center align-items-center"
    >
      <Card className="login-card shadow-lg">
        <Card.Body>

          <div className="logo-section">

            <img
              src={logoSportClub}
              alt="SportClub"
              className="login-logo"
            />

            <p className="login-subtitle">
              Inicia sesión para acceder a tu cuenta
            </p>

          </div>

          {error && (
            <Alert variant="danger">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>

            <Form.Group className="mb-3">
              <Form.Label>Correo Electrónico</Form.Label>

              <Form.Control
                type="email"
                placeholder="Ingrese su correo"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Contraseña</Form.Label>

              <Form.Control
                type="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
              />
            </Form.Group>

            <Button
              type="submit"
              className="login-btn w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner
                    animation="border"
                    size="sm"
                    className="me-2"
                  />
                  Ingresando...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>

          </Form>

        </Card.Body>
      </Card>
    </Container>
  );
}

export default Login;