import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Alert, Badge, Form as BootstrapForm } from "react-bootstrap";
import Swal from "sweetalert2";
import {
  getClassSchedules,
  createClassSchedule,
  updateClassSchedule,
  deleteClassSchedule,
} from "../../services/classScheduleService";
import { getSportRooms } from "../../services/sportRoomService";

const DIAS = [
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
  { value: 7, label: "Domingo" },
];

function diaLabel(value) {
  return DIAS.find((d) => d.value === Number(value))?.label || "-";
}

const emptyForm = {
  sport_room_id: "",
  day_of_week: "",
  start_time: "",
  end_time: "",
  status: true,
};

function AdminClasses() {
  const [schedules, setSchedules] = useState([]);
  const [sportRooms, setSportRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [schedulesRes, sportRoomsRes] = await Promise.all([
        getClassSchedules(),
        getSportRooms(),
      ]);
      setSchedules(schedulesRes.data || []);
      setSportRooms(sportRoomsRes.data || []);
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
    setEditingSchedule(null);
    setFormData(emptyForm);
    setFormErrors({});
    setShowModal(true);
  };

  const handleOpenEdit = (schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      sport_room_id: schedule.sport_room_id ?? schedule.sportRoom?.id ?? "",
      day_of_week: schedule.day_of_week ?? "",
      start_time: (schedule.start_time || "").slice(0, 5),
      end_time: (schedule.end_time || "").slice(0, 5),
      status: schedule.status,
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSchedule(null);
    setFormData(emptyForm);
    setFormErrors({});
  };

  const validate = () => {
    const errors = {};
    if (!formData.sport_room_id) errors.sport_room_id = "Debe seleccionar una asignación.";
    if (!formData.day_of_week) errors.day_of_week = "Debe seleccionar un día.";
    if (!formData.start_time) errors.start_time = "Debe ingresar la hora de inicio.";
    if (!formData.end_time) errors.end_time = "Debe ingresar la hora de término.";
    if (
      formData.start_time &&
      formData.end_time &&
      formData.start_time >= formData.end_time
    ) {
      errors.end_time = "La hora de término debe ser mayor a la hora de inicio.";
    }
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
        sport_room_id: Number(formData.sport_room_id),
        day_of_week: Number(formData.day_of_week),
        start_time: `${formData.start_time}:00`,
        end_time: `${formData.end_time}:00`,
        status: formData.status,
      };

      if (editingSchedule) {
        await updateClassSchedule(editingSchedule.id, payload);
        Swal.fire({ icon: "success", title: "¡Actualizado!", text: "El horario fue actualizado correctamente.", timer: 2000, showConfirmButton: false });
      } else {
        await createClassSchedule(payload);
        Swal.fire({ icon: "success", title: "¡Creado!", text: "El horario fue creado correctamente.", timer: 2000, showConfirmButton: false });
      }

      handleCloseModal();
      fetchAll();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (schedule) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar horario?",
      text: "¿Está seguro de eliminar este horario de clase?",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteClassSchedule(schedule.id);
      Swal.fire({ icon: "success", title: "Eliminado", text: "El horario fue eliminado correctamente.", timer: 2000, showConfirmButton: false });
      fetchAll();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message });
    }
  };

  const handleToggleStatus = async (schedule) => {
    try {
      await updateClassSchedule(schedule.id, { status: !schedule.status });
      setSchedules((prev) =>
        prev.map((s) => (s.id === schedule.id ? { ...s, status: !s.status } : s))
      );
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message });
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h3 style={{ color: "white", margin: 0 }}>Gestión de Horarios</h3>
        <div style={{ display: "flex", gap: "10px" }}>
          <Button variant="outline-light" onClick={fetchAll}>🔄 Refrescar</Button>
          <Button variant="warning" onClick={handleOpenCreate}>+ Nuevo Horario</Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <p style={{ color: "white" }}>Cargando horarios...</p>
      ) : (
        <div style={{ background: "#252525", borderRadius: "15px", padding: "20px", overflowX: "auto" }}>
          <Table variant="dark" hover responsive style={{ marginBottom: 0 }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Deporte</th>
                <th>Sala</th>
                <th>Coach</th>
                <th>Día</th>
                <th>Inicio</th>
                <th>Término</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {schedules.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center text-muted">No hay horarios registrados.</td>
                </tr>
              ) : (
                schedules.map((schedule) => (
                  <tr key={schedule.id}>
                    <td>{schedule.id}</td>
                    <td>{schedule.sportRoom?.sport?.name || "-"}</td>
                    <td>{schedule.sportRoom?.room?.name || "-"}</td>
                    <td>{schedule.sportRoom?.coach?.full_name || schedule.sportRoom?.coach?.email || "-"}</td>
                    <td>{diaLabel(schedule.day_of_week)}</td>
                    <td>{(schedule.start_time || "").slice(0, 5)}</td>
                    <td>{(schedule.end_time || "").slice(0, 5)}</td>
                    <td>
                      <BootstrapForm.Check
                        type="switch"
                        id={`schedule-switch-${schedule.id}`}
                        checked={schedule.status}
                        onChange={() => handleToggleStatus(schedule)}
                        label={schedule.status ? <Badge bg="success">Activo</Badge> : <Badge bg="secondary">Inactivo</Badge>}
                      />
                    </td>
                    <td>
                      <Button size="sm" variant="outline-warning" style={{ marginRight: "6px" }} onClick={() => handleOpenEdit(schedule)}>Editar</Button>
                      <Button size="sm" variant="outline-danger" onClick={() => handleDelete(schedule)}>Eliminar</Button>
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
            {editingSchedule ? "Editar Horario" : "Nuevo Horario"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ background: "#252525" }}>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: "white" }}>Asignación (Deporte / Sala / Coach)</Form.Label>
            <Form.Select
              name="sport_room_id"
              value={formData.sport_room_id}
              onChange={handleChange}
              isInvalid={!!formErrors.sport_room_id}
            >
              <option value="">Seleccione una asignación...</option>
              {sportRooms.map((sr) => (
                <option key={sr.id} value={sr.id}>
                  {sr.sport?.name} - {sr.room?.name} - {sr.coach?.full_name || sr.coach?.email}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{formErrors.sport_room_id}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{ color: "white" }}>Día de la semana</Form.Label>
            <Form.Select
              name="day_of_week"
              value={formData.day_of_week}
              onChange={handleChange}
              isInvalid={!!formErrors.day_of_week}
            >
              <option value="">Seleccione un día...</option>
              {DIAS.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{formErrors.day_of_week}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{ color: "white" }}>Hora de inicio</Form.Label>
            <Form.Control
              type="time"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              isInvalid={!!formErrors.start_time}
            />
            <Form.Control.Feedback type="invalid">{formErrors.start_time}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{ color: "white" }}>Hora de término</Form.Label>
            <Form.Control
              type="time"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              isInvalid={!!formErrors.end_time}
            />
            <Form.Control.Feedback type="invalid">{formErrors.end_time}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Check
              type="switch"
              id="schedule-modal-status-switch"
              name="status"
              label={<span style={{ color: "white" }}>{formData.status ? "Activo" : "Inactivo"}</span>}
              checked={formData.status}
              onChange={handleChange}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer style={{ background: "#1d102e", borderTop: "1px solid #d4af37" }}>
          <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
          <Button variant="warning" onClick={handleSave} disabled={saving}>
            {saving ? "Guardando..." : editingSchedule ? "Guardar Cambios" : "Crear Horario"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminClasses;
