import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";

import { registerUser } from "../services/authService";
import logoSportClub from "../assets/logo_empresa_letra_v1.png";
import "../styles/register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
  full_name: "", 
  email: "",
  password: "",
});

  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    try {
      await registerUser(formData);

      alert("Usuario registrado correctamente");

      navigate("/login");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container
      fluid
      className="register-page d-flex justify-content-center align-items-center"
    >
      <Card className="register-card shadow-lg">
        <Card.Body>

          <div className="logo-section">

            <img
              src={logoSportClub}
              alt="SportClub"
              className="register-logo"
            />

            <p className="register-subtitle">
              Crea una cuenta para comenzar
            </p>

          </div>

          {error && (
            <Alert variant="danger">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>

            <Form.Group className="mb-3">
              <Form.Label>Nombre Completo</Form.Label>

              <Form.Control
                 type="text"
                 name="full_name"
                 placeholder="Ingrese su nombre"
                 value={formData.full_name}
                 onChange={handleChange}
                required
/>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Correo Electrónico</Form.Label>

              <Form.Control
                type="email"
                name="email"
                placeholder="Ingrese su correo"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Contraseña</Form.Label>

              <Form.Control
                type="password"
                name="password"
                placeholder="Ingrese una contraseña"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button
              type="submit"
              className="register-btn w-100"
            >
              Crear Cuenta
            </Button>

          </Form>

          <div className="register-link mt-4">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/login">
              Iniciar Sesión
            </Link>
          </div>

        </Card.Body>
      </Card>
    </Container>
  );
}

export default Register;