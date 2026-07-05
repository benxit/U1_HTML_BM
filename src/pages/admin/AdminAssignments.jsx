import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Alert, Badge, Form as BootstrapForm } from "react-bootstrap";
import Swal from "sweetalert2";
import {
  getSportRooms,
  createSportRoom,
  updateSportRoom,
  deleteSportRoom,
} from "../../services/sportRoomService";
import { getSports } from "../../services/sportService";
import { getRooms } from "../../services/roomService";
import { getCoaches } from "../../services/userService";

const emptyForm = {
  sport_id: "",
  room_id: "",
  coach_id: "",
  observation: "",
  status: true,
};

function AdminAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [sports, setSports] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [assignmentsRes, sportsRes, roomsRes, coachesRes] = await Promise.all([
        getSportRooms(),
        getSports(),
        getRooms(),
        getCoaches(),
      ]);
      setAssignments(assignmentsRes.data || []);
      setSports(sportsRes.data || []);
      setRooms(roomsRes.data || []);
      setCoaches(coachesRes.data || coachesRes || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleOpenCreate = () => {
    setEditingAssignment(null);
    setFormData(emptyForm);
    setFormErrors({});
    setShowModal(true);
  };

  const handleOpenEdit = (assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      sport_id: assignment.sport_id ?? assignment.sport?.id ?? "",
      room_id: assignment.room_id ?? assignment.room?.id ?? "",
      coach_id: assignment.coach_id ?? assignment.coach?.id ?? "",
      observation: assignment.observation || "",
      status: assignment.status,
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAssignment(null);
    setFormData(emptyForm);
    setFormErrors({});
  };

  const validate = () => {
    const errors = {};
    if (!formData.sport_id) errors.sport_id = "Debe seleccionar un deporte.";
    if (!formData.room_id) errors.room_id = "Debe seleccionar una sala.";
    if (!formData.coach_id) errors.coach_id = "Debe seleccionar un coach.";
    return errors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSave = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        sport_id: Number(formData.sport_id),
        room_id: Number(formData.room_id),
        coach_id: Number(formData.coach_id),
        observation: formData.observation.trim() || null,
        status: formData.status,
      };

      if (editingAssignment) {
        await updateSportRoom(editingAssignment.id, payload);
        Swal.fire({ icon: "success", title: "¡Actualizada!", text: "La asignación fue actualizada correctamente.", timer: 2000, showConfirmButton: false });
      } else {
        await createSportRoom(payload);
        Swal.fire({ icon: "success", title: "¡Creada!", text: "La asignación fue creada correctamente.", timer: 2000, showConfirmButton: false });
      }

      handleCloseModal();
      fetchAll();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (assignment) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar asignación?",
      text: `¿Está seguro de eliminar esta asignación de ${assignment.sport?.name || "deporte"}?`,
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteSportRoom(assignment.id);
      Swal.fire({ icon: "success", title: "Eliminada", text: "La asignación fue eliminada correctamente.", timer: 2000, showConfirmButton: false });
      fetchAll();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message });
    }
  };

  const handleToggleStatus = async (assignment) => {
    try {
      await updateSportRoom(assignment.id, { status: !assignment.status });
      setAssignments((prev) =>
        prev.map((a) => (a.id === assignment.id ? { ...a, status: !a.status } : a))
      );
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message });
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h3 style={{ color: "white", margin: 0 }}>Gestión de Asignaciones</h3>
        <div style={{ display: "flex", gap: "10px" }}>
          <Button variant="outline-light" onClick={fetchAll}>🔄 Refrescar</Button>
          <Button variant="warning" onClick={handleOpenCreate}>+ Nueva Asignación</Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <p style={{ color: "white" }}>Cargando asignaciones...</p>
      ) : (
        <div style={{ background: "#252525", borderRadius: "15px", padding: "20px", overflowX: "auto" }}>
          <Table variant="dark" hover responsive style={{ marginBottom: 0 }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Deporte</th>
                <th>Sala</th>
                <th>Coach</th>
                <th>Observación</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {assignments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-muted">No hay asignaciones registradas.</td>
                </tr>
              ) : (
                assignments.map((assignment) => (
                  <tr key={assignment.id}>
                    <td>{assignment.id}</td>
                    <td>{assignment.sport?.name || "-"}</td>
                    <td>{assignment.room?.name || "-"}</td>
                    <td>{assignment.coach?.full_name || assignment.coach?.email || "-"}</td>
                    <td style={{ maxWidth: "200px" }}>{assignment.observation || "-"}</td>
                    <td>
                      <BootstrapForm.Check
                        type="switch"
                        id={`assignment-switch-${assignment.id}`}
                        checked={assignment.status}
                        onChange={() => handleToggleStatus(assignment)}
                        label={assignment.status ? <Badge bg="success">Activa</Badge> : <Badge bg="secondary">Inactiva</Badge>}
                      />
                    </td>
                    <td>
                      <Button size="sm" variant="outline-warning" style={{ marginRight: "6px" }} onClick={() => handleOpenEdit(assignment)}>Editar</Button>
                      <Button size="sm" variant="outline-danger" onClick={() => handleDelete(assignment)}>Eliminar</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      )}

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton style={{ background: "#1d102e", borderBottom: "1px solid #d4af37" }}>
          <Modal.Title style={{ color: "white" }}>
            {editingAssignment ? "Editar Asignación" : "Nueva Asignación"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ background: "#252525" }}>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: "white" }}>Deporte</Form.Label>
            <Form.Select
              name="sport_id"
              value={formData.sport_id}
              onChange={handleChange}
              isInvalid={!!formErrors.sport_id}
            >
              <option value="">Seleccione un deporte...</option>
              {sports.map((sport) => (
                <option key={sport.id} value={sport.id}>{sport.name}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{formErrors.sport_id}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{ color: "white" }}>Sala</Form.Label>
            <Form.Select
              name="room_id"
              value={formData.room_id}
              onChange={handleChange}
              isInvalid={!!formErrors.room_id}
            >
              <option value="">Seleccione una sala...</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>{room.name}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{formErrors.room_id}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{ color: "white" }}>Coach</Form.Label>
            <Form.Select
              name="coach_id"
              value={formData.coach_id}
              onChange={handleChange}
              isInvalid={!!formErrors.coach_id}
            >
              <option value="">Seleccione un coach...</option>
              {coaches.map((coach) => (
                <option key={coach.id} value={coach.id}>{coach.full_name || coach.email}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{formErrors.coach_id}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{ color: "white" }}>Observación</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="observation"
              value={formData.observation}
              onChange={handleChange}
              placeholder="Observaciones opcionales"
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Check
              type="switch"
              id="assignment-modal-status-switch"
              name="status"
              label={<span style={{ color: "white" }}>{formData.status ? "Activa" : "Inactiva"}</span>}
              checked={formData.status}
              onChange={handleChange}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer style={{ background: "#1d102e", borderTop: "1px solid #d4af37" }}>
          <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
          <Button variant="warning" onClick={handleSave} disabled={saving}>
            {saving ? "Guardando..." : editingAssignment ? "Guardar Cambios" : "Crear Asignación"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminAssignments;
