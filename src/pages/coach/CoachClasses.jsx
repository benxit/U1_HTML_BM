function CoachDashboard() {
  return (
    <div className="container-fluid">

      <h1 className="mb-4">
        Dashboard Coach
      </h1>

      <div className="row">

        <div className="col-md-4 mb-3">
          <div className="card shadow">
            <div className="card-body">
              <h5>Mis Clases</h5>
              <h2>0</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow">
            <div className="card-body">
              <h5>Alumnos Inscritos</h5>
              <h2>0</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow">
            <div className="card-body">
              <h5>Horarios</h5>
              <h2>0</h2>
            </div>
          </div>
        </div>

      </div>

      <div className="card shadow mt-4">
        <div className="card-body">

          <h4>Resumen General</h4>

          <p>
            Bienvenido al panel del entrenador.
          </p>

          <p>
            Desde aquí podrás gestionar tus clases,
            alumnos y horarios.
          </p>

        </div>
      </div>

    </div>
  );
}

export default CoachDashboard;