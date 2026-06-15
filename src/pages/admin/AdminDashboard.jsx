function AdminDashboard() {
  return (
    <div>

      <h1 className="dashboard-title">
        Dashboard Administrador
      </h1>

      <div className="stats-container">

        <div className="stat-card">
          <h5>Total Usuarios</h5>
          <h2>25</h2>
        </div>

        <div className="stat-card">
          <h5>Total Coaches</h5>
          <h2>8</h2>
        </div>

        <div className="stat-card">
          <h5>Total Clases</h5>
          <h2>12</h2>
        </div>

      </div>

      <div className="summary-card">

        <h4>
          Resumen General
        </h4>

        <p>
          Bienvenido al panel de administración de SportClub.
        </p>

        <p>
          Desde esta sección podrás gestionar usuarios,
          entrenadores, clases deportivas y supervisar
          toda la actividad del sistema.
        </p>

      </div>

    </div>
  );
}

export default AdminDashboard;