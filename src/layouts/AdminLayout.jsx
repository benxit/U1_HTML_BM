import { Link, Outlet, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { logout } from "../services/authService";
import "../styles/admin.css";

function AdminLayout() {
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

        <Link to="/admin/dashboard">
          Dashboard
        </Link>

        <Link to="/admin/users">
          Usuarios
        </Link>

        <Link to="/admin/coaches">
          Coaches
        </Link>

        <Link to="/admin/rooms">
          Salas
        </Link>

        <Link to="/admin/assignments">
          Asignaciones
        </Link>

        <Link to="/admin/classes">
          Horarios
        </Link>

    
        <Link to="/admin/sports">
          Deportes
        </Link>

        <Link to="/admin/profile">
          Mi Perfil
        </Link>

      </aside>

      <div className="admin-content">

        <header className="admin-header">

          <h3>Panel Administrador</h3>

          <div className="header-buttons">

            <Link
              to="/admin/profile"
              className="profile-btn"
            >
              Mi Perfil
            </Link>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Cerrar Sesión
            </button>

          </div>

        </header>

        <main className="admin-main">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default AdminLayout;
