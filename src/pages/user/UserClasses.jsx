import { useEffect, useState } from "react";
import { Alert, Badge, Button, Modal, Form, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import { getAvailableClasses, createReservation } from "../../services/reservationService";
import "../../styles/user.css";

const DIAS = ["", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

function UserClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState("");
  const [observation, setObservation] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  async function fetchClasses() {
    setLoading(true);
    setError("");
    try {
      const data = await getAvailableClasses();
      setClasses(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleOpenReserve(sportRoomClass) {
    setSelectedClass(sportRoomClass);
    setSelectedScheduleId("");
    setObservation("");
    setFormError("");
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
    setSelectedClass(null);
    setSelectedScheduleId("");
    setObservation("");
    setFormError("");
  }

  async function handleConfirmReservation() {
    if (!selectedScheduleId) {
      setFormError("Debe seleccionar un horario para reservar.");
      return;
    }

    setSaving(true);
    try {
      await createReservation({
        class_schedule_id: Number(selectedScheduleId),
        observation: observation.trim() || undefined,
      });

      Swal.fire({
        icon: "success",
        title: "¡Reserva creada!",
        text: "Tu reserva fue registrada correctamente.",
        timer: 2200,
        showConfirmButton: false,
      });

      handleCloseModal();
      fetchClasses();
    } catch (err) {
      Swal.fire({ icon: "error", title: "No se pudo reservar", text: err.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Clases Disponibles</h1>
        <button className="btn btn-outline-light" onClick={fetchClasses}>
          🔄 Refrescar
        </button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <p>Cargando clases disponibles...</p>
      ) : classes.length === 0 ? (
        <div className="card shadow">
          <div className="card-body">
            <p className="mb-0">No hay clases disponibles por el momento.</p>
          </div>
        </div>
      ) : (
        <div className="row">
          {classes.map((item) => (
            <div className="col-md-6 col-lg-4 mb-4" key={item.id}>
              <div className="card shadow h-100">
                <div className="card-body d-flex flex-column">
                  <h4>{item.sport?.name}</h4>
                  <p className="mb-1">
                    <strong>Sala:</strong> {item.room?.name}
                  </p>
                  <p className="mb-1">
                    <strong>Coach:</strong> {item.coach?.full_name || item.coach?.email}
                  </p>
                  <p className="mb-2">
                    <strong>Capacidad:</strong> {item.room?.capacity}
                  </p>

                  <p className="mb-2">
                    <strong>Horarios:</strong>{" "}
                    {item.schedules && item.schedules.length > 0 ? (
                      item.schedules.map((s) => (
                        <Badge bg="info" className="me-1 mb-1" key={s.id}>
                          {DIAS[s.day_of_week]} {(s.start_time || "").slice(0, 5)}-{(s.end_time || "").slice(0, 5)}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted">Sin horarios definidos</span>
                    )}
                  </p>

                  <Button
                    variant="warning"
                    className="mt-auto"
                    disabled={!item.schedules || item.schedules.length === 0}
                    onClick={() => handleOpenReserve(item)}
                  >
                    Reservar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reservar clase: {selectedClass?.sport?.name}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Horario</Form.Label>
            <Form.Select
              value={selectedScheduleId}
              onChange={(e) => {
                setSelectedScheduleId(e.target.value);
                setFormError("");
              }}
              isInvalid={!!formError}
            >
              <option value="">Seleccione un horario...</option>
              {selectedClass?.schedules?.map((s) => (
                <option key={s.id} value={s.id}>
                  {DIAS[s.day_of_week]} {(s.start_time || "").slice(0, 5)} - {(s.end_time || "").slice(0, 5)}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{formError}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Observación (opcional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Ej: Es mi primera clase"
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
          <Button variant="warning" onClick={handleConfirmReservation} disabled={saving}>
            {saving ? "Reservando..." : "Confirmar Reserva"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UserClasses;
