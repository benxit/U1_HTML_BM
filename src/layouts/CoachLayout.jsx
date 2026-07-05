import { Link, Outlet, useNavigate } from "react-router-dom";
import { logout } from "../services/authService";

function CoachLayout() {

  const navigate = useNavigate();

  function handleLogout() {

    const confirmLogout = window.confirm(
      "¿Desea cerrar sesión?"
    );

    if (!confirmLogout) return;

    logout();
    navigate("/");
  }

  return (
    <div className="admin-layout">

      <aside className="admin-sidebar">

        <h2>SportClub</h2>

        <Link to="/coach/dashboard">
          Dashboard
        </Link>

        <Link to="/coach/classes">
          Mis Clases
        </Link>

        <Link to="/coach/schedule">
          Mi Horario
        </Link>

        <Link to="/coach/students">
          Mis Alumnos
        </Link>

        <Link to="/coach/profile">
          Mi Perfil
        </Link>

      </aside>

      <div className="admin-content">

        <header className="admin-header">

          <h3>Panel Coach</h3>

          <button
            className="btn btn-danger"
            onClick={handleLogout}
          >
            Cerrar Sesión
          </button>

        </header>

        <main className="admin-main">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default CoachLayout;

