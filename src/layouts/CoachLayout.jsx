import { Link, Outlet, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { logout } from "../services/authService";

function CoachLayout() {

  const navigate = useNavigate();

  async function handleLogout() {

    const result = await Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Deberás iniciar sesión nuevamente para acceder.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar"
    });

    if (!result.isConfirmed) return;

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
