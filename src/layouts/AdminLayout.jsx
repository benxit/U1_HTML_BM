import { Link, Outlet, useNavigate } from "react-router-dom";
import { logout } from "../services/authService";
import "../styles/admin.css";

function AdminLayout() {
  const navigate = useNavigate();

  function handleLogout() {
    const confirmLogout = window.confirm(
      "¿Está seguro de que desea cerrar sesión?"
    );

    if (!confirmLogout) return;

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

      </aside>

      <div className="admin-content">

        <header className="admin-header">

          <h3>Panel Administrador</h3>

          <div className="header-buttons">

            <button className="profile-btn">
              Mi Perfil
            </button>

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


