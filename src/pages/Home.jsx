import { Link } from "react-router-dom";
import "../styles/home.css";

function Home() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark navbar-custom">
        <div className="container">
          <span className="navbar-brand fw-bold">
            SportClub
          </span>

          <div>
            <Link
              to="/login"
              className="btn btn-outline-light me-2"
            >
              Iniciar Sesión
            </Link>

            <Link
              to="/register"
              className="btn btn-warning"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </nav>

      <section className="hero-section">
        <div className="container text-center text-white">

          <h1 className="hero-title">
            Bienvenido a SportClub
          </h1>

          <p className="hero-description">
            Plataforma diseñada para gestionar usuarios,
            entrenadores, clases deportivas y reservas
            de manera sencilla y organizada.
          </p>

          <div className="mt-4">
            <Link
              to="/register"
              className="btn btn-warning btn-lg me-3"
            >
              Comenzar
            </Link>

            <Link
              to="/login"
              className="btn btn-outline-light btn-lg"
            >
              Ingresar
            </Link>
          </div>

        </div>
      </section>

      <section className="stats-section">
        <div className="container">
          <div className="row text-center">

            <div className="col-md-3 mb-4">
              <div className="stat-card">
                <h2>500+</h2>
                <p>Usuarios registrados</p>
              </div>
            </div>

            <div className="col-md-3 mb-4">
              <div className="stat-card">
                <h2>30+</h2>
                <p>Entrenadores</p>
              </div>
            </div>

            <div className="col-md-3 mb-4">
              <div className="stat-card">
                <h2>100+</h2>
                <p>Clases realizadas</p>
              </div>
            </div>

            <div className="col-md-3 mb-4">
              <div className="stat-card">
                <h2>95%</h2>
                <p>Satisfacción</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="features-section">

        <div className="container">

          <h2 className="section-title">
            ¿Qué ofrece SportClub?
          </h2>

          <div className="row">

            <div className="col-md-3 mb-4">
              <div className="feature-card">
                <h3>🏋️</h3>
                <h5>Gestión de Clases</h5>
                <p>
                  Organización de clases deportivas y horarios.
                </p>
              </div>
            </div>

            <div className="col-md-3 mb-4">
              <div className="feature-card">
                <h3>👨‍🏫</h3>
                <h5>Entrenadores</h5>
                <p>
                  Administración de entrenadores y actividades.
                </p>
              </div>
            </div>

            <div className="col-md-3 mb-4">
              <div className="feature-card">
                <h3>📅</h3>
                <h5>Reservas</h5>
                <p>
                  Reserva de clases de forma rápida y sencilla.
                </p>
              </div>
            </div>

            <div className="col-md-3 mb-4">
              <div className="feature-card">
                <h3>📊</h3>
                <h5>Seguimiento</h5>
                <p>
                  Control y visualización de la actividad deportiva.
                </p>
              </div>
            </div>

          </div>

        </div>

      </section>

      <section className="about-section">

        <div className="container text-center">

          <h2 className="section-title">
            Sobre Nosotros
          </h2>

          <p className="about-text">
            SportClub es una plataforma orientada a la gestión
            deportiva, permitiendo administrar usuarios,
            entrenadores, clases y reservas en un único sistema.
            Nuestro objetivo es facilitar la organización de las
            actividades deportivas y mejorar la experiencia de
            los participantes.
          </p>

        </div>

      </section>

      <footer className="footer">
        <p>
          © 2026 SportClub - Sistema de Gestión Deportiva
        </p>
      </footer>
    </>
  );
}

export default Home;