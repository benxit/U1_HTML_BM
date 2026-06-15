import { useEffect, useState } from "react";
import { getCoaches } from "../../services/userService";

function AdminCoaches() {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCoaches();
  }, []);

  async function loadCoaches() {
    try {
      const data = await getCoaches();

      setCoaches(data.data || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <h3>Cargando coaches...</h3>;
  }

  if (error) {
    return <h3>{error}</h3>;
  }

  return (
    <div>

      <div className="d-flex justify-content-between align-items-center mb-4">

        <h1 className="dashboard-title">
          Gestión de Coaches
        </h1>

        <button className="btn btn-warning">
          Agregar Coach
        </button>

      </div>

      <div className="card bg-dark text-white shadow">

        <div className="card-body">

          <h4 className="mb-4">
            Coaches Registrados
          </h4>

          <table className="table table-dark table-hover">

            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
              </tr>
            </thead>

            <tbody>

              {coaches.length === 0 ? (
                <tr>
                  <td colSpan="4">
                    No hay coaches registrados
                  </td>
                </tr>
              ) : (
                coaches.map((coach) => (
                  <tr key={coach.id}>

                    <td>{coach.id}</td>

                    <td>
                      {coach.full_name || coach.name}
                    </td>

                    <td>{coach.email}</td>

                    <td>{coach.role}</td>

                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default AdminCoaches;