import { useState } from "react";
import Swal from "sweetalert2";
import { getUser } from "../../services/authService";
import { updateUser } from "../../services/userService";

function AdminProfile() {

  const user = getUser();

  const [fullName, setFullName] = useState(
    user?.full_name || user?.name || ""
  );

  const [email] = useState(
    user?.email || ""
  );

  const [password, setPassword] = useState("");

  async function handleSave() {

    try {

      await updateUser(user.id, {
        full_name: fullName,
        ...(password && { password })
      });

      const updatedUser = {
        ...user,
        full_name: fullName
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setPassword("");

      Swal.fire({
        icon: "success",
        title: "Perfil actualizado",
        text: "Tus datos se guardaron correctamente.",
        timer: 2000,
        showConfirmButton: false
      });

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "No se pudo actualizar",
        text: error.message
      });
    }
  }

  return (
    <div>

      <h1 className="dashboard-title">
        Mi Perfil
      </h1>

      <div className="info-card">

        <div className="mb-3">

          <label className="form-label">
            Nombre Completo
          </label>

          <input
            type="text"
            className="form-control"
            value={fullName}
            onChange={(e) =>
              setFullName(e.target.value)
            }
          />

        </div>

        <div className="mb-3">

          <label className="form-label">
            Correo Electrónico
          </label>

          <input
            type="email"
            className="form-control"
            value={email}
            disabled
          />

        </div>

        <div className="mb-3">

          <label className="form-label">
            Rol
          </label>

          <input
            type="text"
            className="form-control"
            value="Administrador"
            disabled
          />

        </div>

        <div className="mb-4">

          <label className="form-label">
            Nueva Contraseña
          </label>

          <input
            type="password"
            className="form-control"
            placeholder="Dejar vacío para no cambiar"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

        </div>

        <button
          className="btn btn-warning"
          onClick={handleSave}
        >
          Guardar Cambios
        </button>

      </div>

    </div>
  );
}

export default AdminProfile;
