import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Alert, Badge, Form as BootstrapForm } from "react-bootstrap";
import Swal from "sweetalert2";
import {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../../services/roomService";

const emptyForm = {
  name: "",
  description: "",
  capacity: "",
  location: "",
  observation: "",
  status: true,
};

function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchRooms = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getRooms();
      setRooms(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleOpenCreate = () => {
    setEditingRoom(null);
    setFormData(emptyForm);
    setFormErrors({});
    setShowModal(true);
  };

  const handleOpenEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name || "",
      description: room.description || "",
      capacity: room.capacity ?? "",
      location: room.location || "",
      observation: room.observation || "",
      status: room.status,
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRoom(null);
    setFormData(emptyForm);
    setFormErrors({});
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim() || formData.name.trim().length < 3)
      errors.name = "El nombre debe tener al menos 3 caracteres.";
    if (!formData.description.trim() || formData.description.trim().length < 5)
      errors.description = "La descripción debe tener al menos 5 caracteres.";
    if (!formData.capacity || isNaN(formData.capacity) || Number(formData.capacity) < 1)
      errors.capacity = "La capacidad debe ser un número mayor a 0.";
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
        name: formData.name.trim(),
        description: formData.description.trim(),
        capacity: Number(formData.capacity),
        location: formData.location.trim() || null,
        observation: formData.observation.trim() || null,
        status: formData.status,
      };

      if (editingRoom) {
        await updateRoom(editingRoom.id, payload);
        Swal.fire({ icon: "success", title: "¡Actualizado!", text: "La sala fue actualizada correctamente.", timer: 2000, showConfirmButton: false });
      } else {
        await createRoom(payload);
        Swal.fire({ icon: "success", title: "¡Creada!", text: "La sala fue creada correctamente.", timer: 2000, showConfirmButton: false });
      }

      handleCloseModal();
      fetchRooms();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (room) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar sala?",
      text: `¿Está seguro de eliminar "${room.name}"?`,
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteRoom(room.id);
      Swal.fire({ icon: "success", title: "Eliminada", text: "La sala fue eliminada correctamente.", timer: 2000, showConfirmButton: false });
      fetchRooms();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message });
    }
  };

  const handleToggleStatus = async (room) => {
    try {
      await updateRoom(room.id, { status: !room.status });
      setRooms((prev) =>
        prev.map((r) => (r.id === room.id ? { ...r, status: !r.status } : r))
      );
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message });
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h3 style={{ color: "white", margin: 0 }}>Gestión de Salas</h3>
        <div style={{ display: "flex", gap: "10px" }}>
          <Button variant="outline-light" onClick={fetchRooms}>🔄 Refrescar</Button>
          <Button variant="warning" onClick={handleOpenCreate}>+ Nueva Sala</Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <p style={{ color: "white" }}>Cargando salas...</p>
      ) : (
        <div style={{ background: "#252525", borderRadius: "15px", padding: "20px", overflowX: "auto" }}>
          <Table variant="dark" hover responsive style={{ marginBottom: 0 }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Capacidad</th>
                <th>Ubicación</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rooms.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-muted">No hay salas registradas.</td>
                </tr>
              ) : (
                rooms.map((room) => (
                  <tr key={room.id}>
                    <td>{room.id}</td>
                    <td>{room.name}</td>
                    <td style={{ maxWidth: "220px" }}>{room.description}</td>
                    <td>{room.capacity}</td>
                    <td>{room.location || "-"}</td>
                    <td>
                      <BootstrapForm.Check
                        type="switch"
                        id={`room-switch-${room.id}`}
                        checked={room.status}
                        onChange={() => handleToggleStatus(room)}
                        label={room.status ? <Badge bg="success">Activa</Badge> : <Badge bg="secondary">Inactiva</Badge>}
                      />
                    </td>
                    <td>
                      <Button size="sm" variant="outline-warning" style={{ marginRight: "6px" }} onClick={() => handleOpenEdit(room)}>Editar</Button>
                      <Button size="sm" variant="outline-danger" onClick={() => handleDelete(room)}>Eliminar</Button>
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
          <Modal.Title style={{ color: "white" }}>{editingRoom ? "Editar Sala" : "Nueva Sala"}</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ background: "#252525" }}>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: "white" }}>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              isInvalid={!!formErrors.name}
              placeholder="Ej: Sala Fitness 1"
            />
            <Form.Control.Feedback type="invalid">{formErrors.name}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{ color: "white" }}>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="description"
              value={formData.description}
              onChange={handleChange}
              isInvalid={!!formErrors.description}
              placeholder="Ej: Sala equipada con máquinas de musculación"
            />
            <Form.Control.Feedback type="invalid">{formErrors.description}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{ color: "white" }}>Capacidad</Form.Label>
            <Form.Control
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              isInvalid={!!formErrors.capacity}
              placeholder="Ej: 20"
              min="1"
            />
            <Form.Control.Feedback type="invalid">{formErrors.capacity}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{ color: "white" }}>Ubicación</Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Ej: Piso 2, ala norte"
            />
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
              id="room-modal-status-switch"
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
            {saving ? "Guardando..." : editingRoom ? "Guardar Cambios" : "Crear Sala"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminRooms;
