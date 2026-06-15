import { Link, Outlet, useNavigate } from "react-router-dom";
import { logout, getUser } from "../services/authService";
import "../styles/user.css";

function UserLayout() {
  const navigate = useNavigate();
  const user = getUser();

  function handleLogout() {
    const confirmLogout = window.confirm(
      "¿Desea cerrar sesión?"
    );

    if (!confirmLogout) return;

    logout();
    navigate("/");
  }

  return (
    <div className="user-layout">

      <aside className="user-sidebar">

        <h2 className="user-logo">
          SportClub
        </h2>

        <Link to="/user/dashboard">
          Dashboard
        </Link>

        <Link to="/user/classes">
          Mis Clases
        </Link>

        <Link to="/user/profile">
          Mi Perfil
        </Link>

      </aside>

      <div className="user-content">

        <header className="user-header">

          <div>
            <h4>
              Bienvenido
            </h4>

            <span>
              {user?.full_name || user?.name}
            </span>
          </div>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Cerrar Sesión
          </button>

        </header>

        <main className="user-main">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default UserLayout;