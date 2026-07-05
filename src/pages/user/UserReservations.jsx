import { useEffect, useState } from "react";
import { Alert, Badge, Button, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import { getMyReservations, cancelReservation } from "../../services/reservationService";
import "../../styles/user.css";

const DIAS = ["", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

function statusBadge(status) {
  return status === "active" ? (
    <Badge bg="success">Activa</Badge>
  ) : (
    <Badge bg="secondary">Cancelada</Badge>
  );
}

function UserReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  async function fetchReservations() {
    setLoading(true);
    setError("");
    try {
      const data = await getMyReservations();
      setReservations(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(reservation) {
    const result = await Swal.fire({
      icon: "warning",
      title: "¿Cancelar reserva?",
      text: "Esta acción cancelará tu reserva para esta clase.",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "Volver",
    });

    if (!result.isConfirmed) return;

    setCancellingId(reservation.id);
    try {
      await cancelReservation(reservation.id);
      Swal.fire({
        icon: "success",
        title: "Reserva cancelada",
        timer: 2000,
        showConfirmButton: false,
      });
      fetchReservations();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message });
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Mis Reservas</h1>
        <button className="btn btn-outline-light" onClick={fetchReservations}>
          🔄 Refrescar
        </button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <p>Cargando reservas...</p>
      ) : (
        <div className="card shadow">
          <div className="card-body">
            <Table responsive hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Deporte</th>
                  <th>Sala</th>
                  <th>Coach</th>
                  <th>Día</th>
                  <th>Horario</th>
                  <th>Observación</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reservations.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center text-muted">
                      Aún no tienes reservas. Ve a "Mis Clases" para reservar una.
                    </td>
                  </tr>
                ) : (
                  reservations.map((r) => {
                    const sportRoom = r.classSchedule?.sportRoom;
                    return (
                      <tr key={r.id}>
                        <td>{r.id}</td>
                        <td>{sportRoom?.sport?.name || "-"}</td>
                        <td>{sportRoom?.room?.name || "-"}</td>
                        <td>{sportRoom?.coach?.full_name || sportRoom?.coach?.email || "-"}</td>
                        <td>{DIAS[r.classSchedule?.day_of_week] || "-"}</td>
                        <td>
                          {r.classSchedule
                            ? `${(r.classSchedule.start_time || "").slice(0, 5)} - ${(r.classSchedule.end_time || "").slice(0, 5)}`
                            : "-"}
                        </td>
                        <td>{r.observation || "-"}</td>
                        <td>{statusBadge(r.status)}</td>
                        <td>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            disabled={r.status !== "active" || cancellingId === r.id}
                            onClick={() => handleCancel(r)}
                          >
                            {cancellingId === r.id ? "Cancelando..." : "Cancelar"}
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserReservations;
