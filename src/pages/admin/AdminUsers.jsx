import * as bootstrap from "bootstrap";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser
} from "../../services/userService";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [newFullName, setNewFullName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("user");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const data = await getUsers();
      setUsers(data.data || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function openEditModal(user) {
    setSelectedUser(user);
    setFullName(user.full_name || user.name || "");
    setEmail(user.email || "");
    setRole(user.role || "");

    const modal = new bootstrap.Modal(
      document.getElementById("editUserModal")
    );
    modal.show();
  }

  async function handleUpdateUser() {
    try {
      await updateUser(selectedUser.id, {
        full_name: fullName,
        email,
        role
      });

      await Swal.fire({
        icon: "success",
        title: "¡Actualizado!",
        text: "El usuario fue actualizado correctamente.",
        confirmButtonColor: "#6f42c1",
        background: "#1e1e1e",
        color: "#ffffff"
      });

      loadUsers();

      const modal = bootstrap.Modal.getInstance(
        document.getElementById("editUserModal")
      );
      modal.hide();

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
        confirmButtonColor: "#dc3545",
        background: "#1e1e1e",
        color: "#ffffff"
      });
    }
  }

  async function handleDeleteUser(id) {
    const result = await Swal.fire({
      title: "¿Eliminar usuario?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#1e1e1e",
      color: "#ffffff"
    });

    if (!result.isConfirmed) return;

    try {
      await deleteUser(id);

      await Swal.fire({
        icon: "success",
        title: "¡Eliminado!",
        text: "El usuario fue eliminado correctamente.",
        confirmButtonColor: "#6f42c1",
        background: "#1e1e1e",
        color: "#ffffff"
      });

      loadUsers();

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al eliminar",
        text: error.message,
        confirmButtonColor: "#dc3545",
        background: "#1e1e1e",
        color: "#ffffff"
      });
    }
  }

  function openCreateModal() {
    setNewFullName("");
    setNewEmail("");
    setNewPassword("");
    setNewRole("user");

    const modal = new bootstrap.Modal(
      document.getElementById("createUserModal")
    );
    modal.show();
  }

  async function handleCreateUser() {
    try {
      await createUser({
        full_name: newFullName,
        email: newEmail,
        password: newPassword,
        role: newRole
      });

      await Swal.fire({
        icon: "success",
        title: "¡Usuario creado!",
        text: "El usuario fue registrado correctamente.",
        confirmButtonColor: "#6f42c1",
        background: "#1e1e1e",
        color: "#ffffff"
      });

      loadUsers();

      const modal = bootstrap.Modal.getInstance(
        document.getElementById("createUserModal")
      );
      modal.hide();

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al crear",
        text: error.message,
        confirmButtonColor: "#dc3545",
        background: "#1e1e1e",
        color: "#ffffff"
      });
    }
  }

  if (loading) {
    return <h3>Cargando usuarios...</h3>;
  }

  if (error) {
    return <h3>{error}</h3>;
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">

        <h1 className="dashboard-title">
          Gestión de Usuarios
        </h1>

        <button
          className="btn btn-warning"
          onClick={openCreateModal}
        >
          Agregar Usuario
        </button>

      </div>

      <div className="card bg-dark text-white shadow">

        <div className="card-body">

          <h4 className="mb-4">
            Usuarios Registrados
          </h4>

          <table className="table table-dark table-hover">

            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>

                  <td>{user.id}</td>

                  <td>
                    {user.full_name || user.name}
                  </td>

                  <td>{user.email}</td>

                  <td>{user.role}</td>

                  <td>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => openEditModal(user)}
                    >
                      Editar
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Eliminar
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        </div>

      </div>

      {/* Modal Editar Usuario */}
      <div
        className="modal fade"
        id="editUserModal"
        tabIndex="-1"
      >
        <div className="modal-dialog">

          <div className="modal-content bg-dark text-white">

            <div className="modal-header">
              <h5 className="modal-title">
                Editar Usuario
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">

              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Correo</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">Rol</label>
                <select
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="user">Usuario</option>
                  <option value="coach">Coach</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>
              <button
                className="btn btn-warning"
                onClick={handleUpdateUser}
              >
                Guardar Cambios
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Modal Crear Usuario */}
      <div
        className="modal fade"
        id="createUserModal"
        tabIndex="-1"
      >
        <div className="modal-dialog">

          <div className="modal-content bg-dark text-white">

            <div className="modal-header">
              <h5 className="modal-title">
                Agregar Usuario
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">

              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Correo</label>
                <input
                  type="email"
                  className="form-control"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">Rol</label>
                <select
                  className="form-select"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                >
                  <option value="user">Usuario</option>
                  <option value="coach">Coach</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>
              <button
                className="btn btn-warning"
                onClick={handleCreateUser}
              >
                Crear Usuario
              </button>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}

export default AdminUsers;
