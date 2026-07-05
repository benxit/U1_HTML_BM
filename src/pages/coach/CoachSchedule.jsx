import { useEffect, useState } from "react";
import { Alert, Badge, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import { getMySchedules } from "../../services/coachService";
import "../../styles/coach.css";

const DIAS = ["", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

function CoachSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMySchedule();
  }, []);

  async function fetchMySchedule() {
    setLoading(true);
    setError("");
    try {
      const data = await getMySchedules();
      setSchedules(data.data || []);
    } catch (err) {
      setError(err.message);
      Swal.fire({ icon: "error", title: "Error", text: err.message });
    } finally {
      setLoading(false);
    }
  }

  // Agrupar por día para una vista tipo calendario semanal
  const groupedByDay = DIAS.map((_, dayNumber) => ({
    dayNumber,
    label: DIAS[dayNumber],
    items: schedules.filter((s) => s.day_of_week === dayNumber),
  })).filter((g) => g.dayNumber !== 0);

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Mi Horario</h1>
        <button className="btn btn-outline-light" onClick={fetchMySchedule}>
          🔄 Refrescar
        </button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <p>Cargando horario...</p>
      ) : schedules.length === 0 ? (
        <div className="card shadow">
          <div className="card-body">
            <p className="mb-0">Aún no tienes horarios asignados.</p>
          </div>
        </div>
      ) : (
        <div className="row">
          {groupedByDay.map((day) => (
            <div className="col-md-6 col-lg-4 mb-4" key={day.dayNumber}>
              <div className="card shadow h-100">
                <div className="card-body">
                  <h5>{day.label}</h5>
                  {day.items.length === 0 ? (
                    <p className="text-muted mb-0">Sin clases este día.</p>
                  ) : (
                    <Table size="sm" responsive className="mb-0">
                      <thead>
                        <tr>
                          <th>Deporte</th>
                          <th>Sala</th>
                          <th>Horario</th>
                          <th>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {day.items.map((s) => (
                          <tr key={s.id}>
                            <td>{s.sportRoom?.sport?.name}</td>
                            <td>{s.sportRoom?.room?.name}</td>
                            <td>
                              {(s.start_time || "").slice(0, 5)} - {(s.end_time || "").slice(0, 5)}
                            </td>
                            <td>
                              <Badge bg={s.status ? "success" : "secondary"}>
                                {s.status ? "Activo" : "Inactivo"}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CoachSchedule;
