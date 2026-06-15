import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Badge,
  Form as BootstrapForm,
} from "react-bootstrap";
import Swal from "sweetalert2";
import {
  getSports,
  createSport,
  updateSport,
  deleteSport,
  toggleSportStatus,
} from "../../services/sportService";
function formatDate(dateStr) {
  if (!dateStr) return "-";
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ];
  const date = new Date(dateStr);
  const dia = String(date.getUTCDate()).padStart(2, "0");
  const mes = meses[date.getUTCMonth()];
  const anio = date.getUTCFullYear();
  return `${dia} de ${mes} de ${anio}`;
}

const emptyForm = { name: "", objective: "", duration: "", status: true };

function AdminSports() {
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Modal estado
  const [showModal, setShowModal] = useState(false);
  const [editingSport, setEditingSport] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Cargar deportes
  const fetchSports = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getSports();
      setSports(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSports();
  }, []);

  // Abrir modal crear
  const handleOpenCreate = () => {
    setEditingSport(null);
    setFormData(emptyForm);
    setFormErrors({});
    setShowModal(true);
  };

  // Abrir modal editar
  const handleOpenEdit = (sport) => {
    setEditingSport(sport);
    setFormData({
      name: sport.name,
      objective: sport.objective,
      duration: sport.duration,
      status: sport.status,
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSport(null);
    setFormData(emptyForm);
    setFormErrors({});
  };

  // Validaciion
  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "El nombre es obligatorio.";
    if (!formData.objective.trim()) errors.objective = "El objetivo es obligatorio.";
    if (!formData.duration || isNaN(formData.duration) || Number(formData.duration) <= 0)
      errors.duration = "La duración es obligatoria y debe ser mayor a 0.";
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
        objective: formData.objective.trim(),
        duration: Number(formData.duration),
        status: formData.status,
      };

      if (editingSport) {
        await updateSport(editingSport.id, payload);
        Swal.fire({
          icon: "success",
          title: "¡Actualizado!",
          text: "El deporte fue actualizado correctamente.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        await createSport(payload);
        Swal.fire({
          icon: "success",
          title: "¡Creado!",
          text: "El deporte fue creado correctamente.",
          timer: 2000,
          showConfirmButton: false,
        });
      }

      handleCloseModal();
      fetchSports();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message,
      });
    } finally {
      setSaving(false);
    }
  };

  // Eliminar con SweetAlert2
  const handleDelete = async (sport) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar deporte?",
      text: `¿Está seguro de eliminar "${sport.name}"?`,
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteSport(sport.id);
      Swal.fire({
        icon: "success",
        title: "Eliminado",
        text: "El deporte fue eliminado correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });
      fetchSports();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message });
    }
  };

  const handleToggleStatus = async (sport) => {
    try {
      await toggleSportStatus(sport.id, !sport.status);
      setSports((prev) =>
        prev.map((s) =>
          s.id === sport.id ? { ...s, status: !s.status } : s
        )
      );
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message });
    }
  };

  return (
    <div>
  
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h3 style={{ color: "white", margin: 0 }}>Gestión de Deportes</h3>
        <div style={{ display: "flex", gap: "10px" }}>
          <Button variant="outline-light" onClick={fetchSports}>
            🔄 Refrescar
          </Button>
          <Button variant="warning" onClick={handleOpenCreate}>
            + Nuevo Deporte
          </Button>
        </div>
      </div>

      {/* Error de carga */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Tabla */}
      {loading ? (
        <p style={{ color: "white" }}>Cargando deportes...</p>
      ) : (
        <div
          style={{
            background: "#252525",
            borderRadius: "15px",
            padding: "20px",
            overflowX: "auto",
          }}
        >
          <Table
            variant="dark"
            hover
            responsive
            style={{ marginBottom: 0 }}
          >
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Objetivo</th>
                <th>Duración (min)</th>
                <th>Estado</th>
                <th>Fecha de Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-muted">
                    No hay deportes registrados.
                  </td>
                </tr>
              ) : (
                sports.map((sport) => (
                  <tr key={sport.id}>
                    <td>{sport.id}</td>
                    <td>{sport.name}</td>
                    <td style={{ maxWidth: "220px" }}>{sport.objective}</td>
                    <td>{sport.duration}</td>
                    <td>
                      <BootstrapForm.Check
                        type="switch"
                        id={`switch-${sport.id}`}
                        checked={sport.status}
                        onChange={() => handleToggleStatus(sport)}
                        label={
                          sport.status ? (
                            <Badge bg="success">Activo</Badge>
                          ) : (
                            <Badge bg="secondary">Inactivo</Badge>
                          )
                        }
                      />
                    </td>
                    <td>{formatDate(sport.created_at)}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="outline-warning"
                        style={{ marginRight: "6px" }}
                        onClick={() => handleOpenEdit(sport)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleDelete(sport)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      )}

      {/* Modal Crear / Editar */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header
          closeButton
          style={{ background: "#1d102e", borderBottom: "1px solid #d4af37" }}
        >
          <Modal.Title style={{ color: "white" }}>
            {editingSport ? "Editar Deporte" : "Nuevo Deporte"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ background: "#252525" }}>
          {/* Nombre */}
          <Form.Group className="mb-3">
            <Form.Label style={{ color: "white" }}>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              isInvalid={!!formErrors.name}
              placeholder="Ej: CrossFit"
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.name}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Objetivo */}
          <Form.Group className="mb-3">
            <Form.Label style={{ color: "white" }}>Objetivo</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="objective"
              value={formData.objective}
              onChange={handleChange}
              isInvalid={!!formErrors.objective}
              placeholder="Ej: Mejorar fuerza y resistencia"
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.objective}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Duración */}
          <Form.Group className="mb-3">
            <Form.Label style={{ color: "white" }}>
              Duración (minutos)
            </Form.Label>
            <Form.Control
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              isInvalid={!!formErrors.duration}
              placeholder="Ej: 60"
              min="1"
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.duration}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Estado */}
          <Form.Group className="mb-2">
            <Form.Check
              type="switch"
              id="modal-status-switch"
              name="status"
              label={
                <span style={{ color: "white" }}>
                  {formData.status ? "Activo" : "Inactivo"}
                </span>
              }
              checked={formData.status}
              onChange={handleChange}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer
          style={{ background: "#1d102e", borderTop: "1px solid #d4af37" }}
        >
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="warning" onClick={handleSave} disabled={saving}>
            {saving ? "Guardando..." : editingSport ? "Guardar Cambios" : "Crear Deporte"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminSports;
