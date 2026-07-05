import { useEffect, useState } from "react";
import { Alert, Badge, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import { getMyClasses } from "../../services/coachService";
import "../../styles/coach.css";

const DIAS = ["", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

function CoachClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyClasses();
  }, []);

  async function fetchMyClasses() {
    setLoading(true);
    setError("");
    try {
      const data = await getMyClasses();
      setClasses(data.data || []);
    } catch (err) {
      setError(err.message);
      Swal.fire({ icon: "error", title: "Error", text: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Mis Clases</h1>
        <button className="btn btn-outline-light" onClick={fetchMyClasses}>
          🔄 Refrescar
        </button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <p>Cargando clases...</p>
      ) : classes.length === 0 ? (
        <div className="card shadow">
          <div className="card-body">
            <p className="mb-0">Aún no tienes deportes/salas asignadas por el administrador.</p>
          </div>
        </div>
      ) : (
        classes.map((item) => (
          <div className="card shadow mb-3" key={item.id}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h4>{item.sport?.name}</h4>
                  <p className="mb-1">
                    <strong>Sala:</strong> {item.room?.name} ({item.room?.location || "sin ubicación"})
                  </p>
                  <p className="mb-1">
                    <strong>Capacidad:</strong> {item.room?.capacity}
                  </p>
                  {item.observation && (
                    <p className="mb-1">
                      <strong>Observación:</strong> {item.observation}
                    </p>
                  )}
                </div>
                <Badge bg={item.status ? "success" : "secondary"}>
                  {item.status ? "Activa" : "Inactiva"}
                </Badge>
              </div>

              <hr />

              <h6>Horarios de esta clase</h6>
              {item.schedules && item.schedules.length > 0 ? (
                <Table size="sm" responsive className="mb-0">
                  <thead>
                    <tr>
                      <th>Día</th>
                      <th>Inicio</th>
                      <th>Término</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.schedules.map((s) => (
                      <tr key={s.id}>
                        <td>{DIAS[s.day_of_week]}</td>
                        <td>{(s.start_time || "").slice(0, 5)}</td>
                        <td>{(s.end_time || "").slice(0, 5)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted mb-0">Sin horarios definidos aún.</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default CoachClasses;
