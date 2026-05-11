const API_URL = 'http://localhost:3000/api';

const token = localStorage.getItem('token');

if (!token) {
    window.location.href = '../index.html';
}

/* Mostrar / ocultar formulario */

const toggleBtn = document.getElementById('toggleFormBtn');
const formContainer = document.getElementById('formContainer');

toggleBtn.addEventListener('click', () => {

    if (formContainer.style.display === 'block') {
        formContainer.style.display = 'none';
    } else {
        formContainer.style.display = 'block';
    }

});

/* Cargar usuarios */

async function cargarUsuarios() {

    try {

        const response = await fetch(`${API_URL}/users`, {

            method: 'GET',

            headers: {
                Authorization: `Bearer ${token}`
            }

        });

        const data = await response.json();

        console.log(data);

        const table = document.getElementById('usersTable');

        table.innerHTML = '';

        const users = data.data || data.users || data;

        users.forEach(user => {

            let roleClass = 'user';

            if (user.role === 'admin') {
                roleClass = 'admin';
            }

            else if (user.role === 'coach') {
                roleClass = 'coach';
            }

            table.innerHTML += `

                <tr>

                    <td>${user.id}</td>

                    <td>${user.full_name}</td>

                    <td>${user.email}</td>

                    <td>
                        <span class="badge ${roleClass}">
                            ${user.role}
                        </span>
                    </td>

                    <td>

                        <div class="actions">

                            <button
                                class="btn-edit"
                                onclick="editarUsuario(
                                    ${user.id},
                                    '${user.full_name}',
                                    '${user.role}'
                                )"
                            >
                                Editar
                            </button>

                            <button
                                class="btn-delete"
                                onclick="eliminarUsuario(${user.id})"
                            >
                                Eliminar
                            </button>

                        </div>

                    </td>

                </tr>

            `;

        });

    } catch (error) {

        console.error(error);

    }

}

/* Crear usuario */

document.getElementById('createUserForm')
.addEventListener('submit', async function(e) {

    e.preventDefault();

    const full_name =
        document.getElementById('full_name').value;

    const email =
        document.getElementById('email').value;

    const role =
        document.getElementById('role').value;

    const password =
        document.getElementById('password').value;

    const message =
        document.getElementById('message');

    message.textContent = '';

    try {

        const response = await fetch(`${API_URL}/users`, {

            method: 'POST',

            headers: {

                'Content-Type': 'application/json',

                Authorization: `Bearer ${token}`

            },

            body: JSON.stringify({

                full_name,
                email,
                role,
                password,
                confirm_password: password

            })

        });

        const data = await response.json();

        console.log(data);

        if (!response.ok) {

            message.textContent =
                data.message || 'Error al crear usuario';

            message.style.color = 'red';

            return;

        }

        message.textContent =
            'Usuario creado correctamente';

        message.style.color = 'green';

        document.getElementById('createUserForm').reset();

        cargarUsuarios();

    } catch (error) {

        console.error(error);

    }

});

/* Eliminar usuario */

async function eliminarUsuario(id) {

    const confirmar = confirm('¿Eliminar usuario?');

    if (!confirmar) return;

    try {

        const response = await fetch(`${API_URL}/users/${id}`, {

            method: 'DELETE',

            headers: {
                Authorization: `Bearer ${token}`
            }

        });

        if (!response.ok) {

            alert('No se pudo eliminar');

            return;

        }

        cargarUsuarios();

    } catch (error) {

        console.error(error);

    }

}

/* Editar usuario */

async function editarUsuario(id, nombreActual, rolActual) {

    const nuevoNombre = prompt(
        'Nuevo nombre:',
        nombreActual
    );

    if (!nuevoNombre) return;

    const nuevoRol = prompt(
        'Nuevo rol (admin, coach, user):',
        rolActual
    );

    if (!nuevoRol) return;

    try {

        const response = await fetch(`${API_URL}/users/${id}`, {

            method: 'PUT',

            headers: {

                'Content-Type': 'application/json',

                Authorization: `Bearer ${token}`

            },

            body: JSON.stringify({

                full_name: nuevoNombre,
                role: nuevoRol

            })

        });

        const data = await response.json();

        console.log(data);

        if (!response.ok) {

            alert('No se pudo actualizar');

            return;

        }

        cargarUsuarios();

    } catch (error) {

        console.error(error);

    }

}

function cerrarSesion() {

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    window.location.href = '../index.html';

}

cargarUsuarios();