import { getUser } from "../../services/authService";
import "../../styles/user.css";

function UserDashboard() {

  const user = getUser();

  return (
    <div>

      <h1 className="dashboard-title">
        Dashboard Usuario
      </h1>

      <div className="welcome-card">

        <h2>
          Hola,
          {" "}
          {user?.full_name || user?.name}
        </h2>

        <p>
          Bienvenido a SportClub.
          Aquí podrás gestionar tus clases,
          consultar información y mantener
          actualizado tu perfil.
        </p>

      </div>

      <div className="dashboard-grid">

        <div className="dashboard-card">
          <h4>Mis Clases</h4>
          <h2>0</h2>
          <p>Clases inscritas</p>
        </div>

        <div className="dashboard-card">
          <h4>Coach Asignado</h4>
          <h2>-</h2>
          <p>Entrenador principal</p>
        </div>

        <div className="dashboard-card">
          <h4>Próxima Clase</h4>
          <h2>-</h2>
          <p>Sin clases programadas</p>
        </div>

      </div>

      <div className="info-card">

        <h3>
          Resumen General
        </h3>

        <p>
          Desde este panel podrás acceder
          a tus clases, revisar información
          importante y administrar tu cuenta.
        </p>

      </div>

    </div>
  );
}

export default UserDashboard;