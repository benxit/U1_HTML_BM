import { useState } from "react";
import { getUser } from "../../services/authService";
import { updateUser } from "../../services/userService";

function CoachProfile() {

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

      alert("Perfil actualizado correctamente");

    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div>

      <h1 className="mb-4">
        Mi Perfil
      </h1>

      <div className="card shadow">

        <div className="card-body">

          <div className="mb-3">

            <label className="form-label">
              Nombre
            </label>

            <input
              className="form-control"
              value={fullName}
              onChange={(e) =>
                setFullName(e.target.value)
              }
            />

          </div>

          <div className="mb-3">

            <label className="form-label">
              Correo
            </label>

            <input
              className="form-control"
              value={email}
              disabled
            />

          </div>

          <div className="mb-3">

            <label className="form-label">
              Nueva Contraseña
            </label>

            <input
              type="password"
              className="form-control"
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

    </div>
  );
}

export default CoachProfile;